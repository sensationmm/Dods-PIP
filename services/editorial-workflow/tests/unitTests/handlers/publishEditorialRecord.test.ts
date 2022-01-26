import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { BadParameterError } from '../../../src/domain';
import { DocumentRepository, EditorialRecordRepository, DocumentPayloadResponse } from '@dodsgroup/dods-repositories';
import { mocked } from 'ts-jest/utils';
import { publishEditorialRecord } from '../../../src/handlers/publishEditorialRecord/publishEditorialRecord';

const defaultContext = createContext();

const defaultCreatedRecord: any = {
    uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
    documentName: 'NewDocument',
    s3Location: 'SomeLocation',
};

const isPublishedRecord: any = {
    uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da170',
    documentName: 'NewDocument',
    s3Location: 'SomeLocation',
    isPublished: true
};

const defaultBucketResponse: DocumentPayloadResponse = {
    success: true,
    payload: JSON.stringify({ data: {} })
}

jest.mock('@dodsgroup/dods-repositories');

const mockedEditorialRecordRepository = mocked(EditorialRecordRepository, true);
const mockedDocumentRepository = mocked(DocumentRepository, true);

mockedEditorialRecordRepository.defaultInstance.getEditorialRecord.mockImplementation(
    (recordId) => {
        if (recordId === 'f9d1482a-77e8-440e-a370-7e06fa0da176') return defaultCreatedRecord;
        if (recordId === 'f9d1482a-77e8-440e-a370-7e06fa0da170') return isPublishedRecord;
        if (recordId === 'BadId') throw new BadParameterError('Error: Bad Parameter');
        throw Error('Generic Error');
    }
);

mockedEditorialRecordRepository.defaultInstance.updateEditorialRecord.mockResolvedValue(defaultCreatedRecord);

const FUNCTION_NAME = publishEditorialRecord.name;

describe(`${FUNCTION_NAME} handler`, () => {

    test('Valid input - response should be "healthy"', async () => {
        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
        };
        mockedDocumentRepository.defaultInstance.publishDocument.mockResolvedValue(true);
        mockedDocumentRepository.defaultInstance.getDocumentByArn.mockResolvedValue(defaultBucketResponse);

        const response = await publishEditorialRecord(requestParams, defaultContext);

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Editorial Record Published',
            data: defaultCreatedRecord,
        });

        expect(EditorialRecordRepository.defaultInstance.getEditorialRecord).toBeCalledWith(
            requestParams.recordId
        );
        expect(response).toEqual(expectedHealthyResponse);
    });

    test('Record is already published', async () => {
        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da170',
        };
        mockedDocumentRepository.defaultInstance.publishDocument.mockResolvedValue(true);
        mockedDocumentRepository.defaultInstance.getDocumentByArn.mockResolvedValue(defaultBucketResponse);

        const response = await publishEditorialRecord(requestParams, defaultContext);

        const expectedBadResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Record is already published'
        });

        expect(EditorialRecordRepository.defaultInstance.getEditorialRecord).toBeCalledWith(
            requestParams.recordId
        );

        expect(response).toEqual(expectedBadResponse);
    });

    test('Lambda Bad Request case', async () => {
        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
        };
        mockedDocumentRepository.defaultInstance.publishDocument.mockResolvedValue(false);
        mockedDocumentRepository.defaultInstance.getDocumentByArn.mockResolvedValue(defaultBucketResponse);

        const response = await publishEditorialRecord(requestParams, defaultContext);

        const expectedBadResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: defaultBucketResponse.payload
        });

        expect(EditorialRecordRepository.defaultInstance.getEditorialRecord).toBeCalledWith(
            requestParams.recordId
        );

        expect(response).toEqual(expectedBadResponse);
    });

    test('Bucket Bad Request case', async () => {
        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
        };

        const BadBucketResponse: DocumentPayloadResponse = {
            success: false,
            payload: ''
        };

        mockedDocumentRepository.defaultInstance.publishDocument.mockResolvedValue(true);
        mockedDocumentRepository.defaultInstance.getDocumentByArn.mockResolvedValue(BadBucketResponse);

        const response = await publishEditorialRecord(requestParams, defaultContext);

        const expectedBadResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, { success: false, message: '' });

        expect(EditorialRecordRepository.defaultInstance.getEditorialRecord).toBeCalledWith(requestParams.recordId);

        expect(response).toEqual(expectedBadResponse);
    });

    test('Service Error - should throw', async () => {
        const requestParams = {
            recordId: 'serviceError',
        };
        try {
            await publishEditorialRecord(requestParams, defaultContext);
            expect(true).toBe(false);
        } catch (e) {
            expect(e).toHaveProperty('message', 'Generic Error');
        }
    });
});

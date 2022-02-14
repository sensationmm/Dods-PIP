import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { BadParameterError } from '../../../src/domain';
import { DocumentRepository, EditorialRecordRepository } from '@dodsgroup/dods-repositories';
import { getEditorialRecord } from '../../../src/handlers/getEditorialRecord/getEditorialRecord';
import { mocked } from 'ts-jest/utils';

const defaultContext = createContext();

const defaultCreatedRecord: any = {
    uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
    documentName: 'NewDocument',
    s3Location: 'SomeLocation',
    document: {
        documentTitle: "Test Document"
    }
};

jest.mock('@dodsgroup/dods-repositories');

const defaultgetDocumentRecord = {
    response: { data: { payload: { documentTitle: "Test Document" } } }
};

const mockedEditorialRecordRepository = mocked(EditorialRecordRepository, true);
const mockedDocumentServiceRepository = mocked(DocumentRepository, true);

mockedEditorialRecordRepository.defaultInstance.getEditorialRecord.mockImplementation(
    (recordId) => {
        if (recordId === 'f9d1482a-77e8-440e-a370-7e06fa0da176') return defaultCreatedRecord;
        if (recordId === 'BadId') throw new BadParameterError('Error: Bad Parameter');
        throw Error('Generic Error');
    }
);

mockedDocumentServiceRepository.defaultInstance.getDocument.mockResolvedValue(defaultgetDocumentRecord);

const FUNCTION_NAME = getEditorialRecord.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be "healthy"', async () => {
        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
        };
        const response = await getEditorialRecord(requestParams, defaultContext);

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Editorial Record found.',
            data: defaultCreatedRecord,
        });

        expect(EditorialRecordRepository.defaultInstance.getEditorialRecord).toBeCalledWith(
            requestParams.recordId
        );
        expect(response).toEqual(expectedHealthyResponse);
    });

    test('Bad input - response should be "Bad Request"', async () => {
        const requestParams = {
            recordId: 'BadId',
        };
        const response = await getEditorialRecord(requestParams, defaultContext);

        const expectedBadResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Error: Bad Parameter',
        });

        expect(EditorialRecordRepository.defaultInstance.getEditorialRecord).toBeCalledWith(
            requestParams.recordId
        );
        expect(response).toEqual(expectedBadResponse);
    });

    test('Service Error - should throw', async () => {
        const requestParams = {
            recordId: 'serviceError',
        };
        try {
            await getEditorialRecord(requestParams, defaultContext);
            expect(true).toBe(false);
        } catch (e) {
            expect(e).toHaveProperty('message', 'Generic Error');
        }
    });
});

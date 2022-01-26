import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { BadParameterError } from '../../../src/domain';
import { DocumentRepository, EditorialRecordRepository } from '@dodsgroup/dods-repositories';
import { getEditorialRecordDocument } from '../../../src/handlers/getEditorialRecordDocument/getEditorialRecordDocument';
import { mocked } from 'ts-jest/utils';

const defaultContext = createContext();

const defaultCreatedRecord: any = {
    uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
    documentName: 'NewDocument',
};

const defaultgetDocumentRecord = {
    response: { data: { payload: { documentTitle: "Test Document" } } }
};

jest.mock('@dodsgroup/dods-repositories');

const mockedEditorialRecordRepository = mocked(EditorialRecordRepository, true);
const mockedDocumentServiceRepository = mocked(DocumentRepository, true);

mockedEditorialRecordRepository.defaultInstance.updateEditorialRecord.mockImplementation(
    (params) => {
        if (params.recordId === 'f9d1482a-77e8-440e-a370-7e06fa0da176') return defaultCreatedRecord;
        if (params.recordId === 'BadId') throw new BadParameterError('Error: Bad Parameter');
        throw Error('Generic Error');
    }
);

mockedEditorialRecordRepository.defaultInstance.getEditorialRecord.mockImplementation(
    (recordId) => {
        if (recordId === 'f9d1482a-77e8-440e-a370-7e06fa0da176') return defaultCreatedRecord;
        if (recordId === 'BadId') throw new BadParameterError('Error: Bad Parameter');
        throw Error('Generic Error');
    }
);

const FUNCTION_NAME = getEditorialRecordDocument.name;

describe(`${FUNCTION_NAME} handler`, () => {

    test('Valid input - response should be "healthy"', async () => {

        const params = { recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176' }

        mockedDocumentServiceRepository.defaultInstance.getDocument.mockResolvedValue(defaultgetDocumentRecord);

        const response = await getEditorialRecordDocument(params, defaultContext);

        const defaultPayloadResponse = defaultgetDocumentRecord.response.data.payload

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Document found',
            document: defaultPayloadResponse,
        });

        expect(response).toEqual(expectedHealthyResponse);
    });

    test('Not found Error - should throw', async () => {

        const params = { recordId: 'BadId' }

        mockedDocumentServiceRepository.defaultInstance.getDocument.mockResolvedValue(defaultgetDocumentRecord);

        const response = await getEditorialRecordDocument(params, defaultContext);

        const expectedBadResponse = new HttpResponse(HttpStatusCode.NOT_FOUND, {
            success: false,
            message: 'Error: Bad Parameter',
        });

        expect(response).toEqual(expectedBadResponse);
    });

});

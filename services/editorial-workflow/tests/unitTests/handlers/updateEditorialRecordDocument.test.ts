import { DocumentRepository, EditorialRecordRepository } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { BadParameterError } from '../../../src/domain';
import { mocked } from 'ts-jest/utils';
import { updateEditorialRecordDocument } from '../../../src/handlers/updateEditorialRecordDocument/updateEditorialRecordDocument';

const defaultContext = createContext();

const defaultCreatedRecord: any = {
    uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
    documentName: 'NewDocument',
    contentDateTime: "2022-02-14T20:56:30.654Z"
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

const FUNCTION_NAME = updateEditorialRecordDocument.name;

describe(`${FUNCTION_NAME} handler`, () => {

    test('Valid input - response should be "healthy"', async () => {

        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
            document: { documentTitle: "new title" }
        };

        mockedDocumentServiceRepository.defaultInstance.updateDocument.mockResolvedValue({ success: true, payload: { contentDateTime: "2022-02-14T20:56:30.654Z" } });

        const response = await updateEditorialRecordDocument(requestParams, defaultContext);

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Document and editorial Record updated.',
            data: defaultCreatedRecord,
        });

        expect(response).toEqual(expectedHealthyResponse);
    });


    test('invalid document Update ', async () => {

        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
            document: { documentTitle: "new title" }
        };

        mockedDocumentServiceRepository.defaultInstance.updateDocument.mockResolvedValue({ success: false, payload: { contentDateTime: "2022-02-14T20:56:30.654Z" } });

        const response = await updateEditorialRecordDocument(requestParams, defaultContext);

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Imposible to update',
        });

        expect(response).toEqual(expectedHealthyResponse);
    });
});

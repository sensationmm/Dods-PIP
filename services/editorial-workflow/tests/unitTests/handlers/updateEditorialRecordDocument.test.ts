import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { BadParameterError } from '../../../src/domain';
import { DocumentServiceRepository } from '../../../src/repositories/DocumentServiceRepository';
import { EditorialRecordRepository } from '../../../src/repositories/EditorialRecordRepository';
import { mocked } from 'ts-jest/utils';
import { updateEditorialRecordDocument } from '../../../src/handlers/updateEditorialRecordDocument/updateEditorialRecordDocument';

const defaultContext = createContext();

const defaultCreatedRecord: any = {
    uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
    documentName: 'NewDocument',
};

jest.mock('../../../src/repositories/EditorialRecordRepository');
jest.mock('../../../src/repositories/DocumentServiceRepository');

const mockedEditorialRecordRepository = mocked(EditorialRecordRepository, true);
const mockedDocumentServiceRepository = mocked(DocumentServiceRepository, true);

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

        mockedDocumentServiceRepository.defaultInstance.updateDocument.mockResolvedValue(true);

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

        mockedDocumentServiceRepository.defaultInstance.updateDocument.mockResolvedValue(false);

        const response = await updateEditorialRecordDocument(requestParams, defaultContext);

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Imposible to update',
        });

        expect(response).toEqual(expectedHealthyResponse);
    });
});

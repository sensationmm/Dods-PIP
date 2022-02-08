import { DocumentRepository, EditorialRecordRepository } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { editPublishedDocument } from '../../../src/handlers/editPublishedDocument/editPublishedDocument';
import { mocked } from 'ts-jest/utils';

const defaultContext = createContext();

const basicCreatedRecord: any = {
    uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
    documentName: 'NewDocument',
    informationType: 'Random Doc',
    contentSource: 'Manual Injection',
    status: {
        uuid: '89cf96f7-d380-4c30-abcf-74c57843f50c',
        status: 'Draft',
    },
    assignedEditor: {
        uuid: '0698280d-8b0f-4a2c-8892-e1599e407fb4',
        fullName: 'Employee Example',
    },
    createdAt: '2021-11-08T16:20:58.000Z',
    updatedAt: '2021-11-08T16:20:58.000Z',
    reload: () => { },
    setAssignedEditor: () => { },
    setStatus: () => { },
};

const documentResponse = {
    data: {
        docuementTitle: 'Test document Title.',
        documentId: 'documentUUID',
        version: '1.0',
        ingestedDateTime: "2021-11-08T16:20:58.000Z",
        contentSource: 'documentContentSource',
        infomationType: 'documentInformationType',
        createdDateTime: "2021-11-08T16:20:58.000Z",
        aggs_fields: {}
    }
}

jest.mock('@dodsgroup/dods-repositories');

const mockedEditorialRecordRepository = mocked(EditorialRecordRepository, true);
const mockedDocumentRepository = mocked(DocumentRepository, true);

const FUNCTION_NAME = editPublishedDocument.name;

describe(`${FUNCTION_NAME} handler`, () => {

    test('Valid input, basic parameters - response should be "healthy"', async () => {

        const requestParams = { documentId: 'documentUUID' };


        mockedDocumentRepository.defaultInstance.getDocumentById.mockResolvedValue(documentResponse);
        mockedEditorialRecordRepository.defaultInstance.createEditorialRecord.mockResolvedValue(basicCreatedRecord);

        const response = await editPublishedDocument(requestParams, defaultContext);

        const expectedCreatedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Editorial Record Created.',
            data: basicCreatedRecord,
        });

        expect(response).toEqual(expectedCreatedResponse);
    });

    test('Invalid input, ', async () => {

        const requestParams = { documentId: 'documentUUID' };

        mockedDocumentRepository.defaultInstance.getDocumentById.mockImplementation(() => { throw new Error('Generic Error'); });

        mockedEditorialRecordRepository.defaultInstance.createEditorialRecord.mockResolvedValue(basicCreatedRecord);

        const response = await editPublishedDocument(requestParams, defaultContext);

        const expectedCreatedResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Please verify document information',
        });

        expect(response).toEqual(expectedCreatedResponse);
    });


});

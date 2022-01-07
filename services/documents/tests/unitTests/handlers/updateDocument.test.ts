import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { DocumentStorageRepository } from '../../../src/repositories';
import { mocked } from 'ts-jest/utils';
import { updateDocument } from '../../../src/handlers/updateDocument/updateDocument';
import { updateDocumentParameters } from '../../../src/domain';

const defaultContext = createContext();

const documentPayload = {
    documentId: 'example',
    jurisdiction: 'UK',
    documentTitle: 'Professional Qualifications Bill [Lords]',
    organisationName: '',
    sourceReferenceFormat: 'text/html',
    sourceReferenceUri: 'example.com',
    createdBy: '',
    internallyCreated: false,
    schemaType: '',
    contentSource: 'House of Commons',
    informationType: 'Debates',
    contentDateTime: '2021-12-15T00:00:00',
    createdDateTime: '2021-12-16T01:30:46.299913',
    ingestedDateTime: '',
    version: '1.0',
    countryOfOrigin: 'GBR',
    feedFormat: 'text/plain',
    language: 'en',
    taxonomyTerms: [],
    originalContent: '',
    documentContent: '',
};

const defaultStoredDocument: any = {
    success: true,
    payload: JSON.stringify(documentPayload),
};

const errorStoredDocument: any = {
    success: false,
};

jest.mock('../../../src/repositories/DocumentStorageRepository');

const mockedDocumentStorageRepository = mocked(DocumentStorageRepository, true);

mockedDocumentStorageRepository.defaultInstance.getDocumentByArn.mockImplementation((arn) => {
    if (arn === 'GoodARN') return defaultStoredDocument;
    if (arn === 'BadARN') return errorStoredDocument;
    throw Error('Generic Error');
});

const FUNCTION_NAME = updateDocument.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be "healthy"', async () => {

        mockedDocumentStorageRepository.defaultInstance.updateDocumemt.mockResolvedValue(true);

        const requestParams: updateDocumentParameters = {
            arn: 'GoodARN',
            document: ""
        };
        const response = await updateDocument(requestParams, defaultContext);

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Document Successfully Updated',
            payload: documentPayload,
        });


        expect(DocumentStorageRepository.defaultInstance.getDocumentByArn).toBeCalledWith(
            requestParams.arn
        );
        expect(response).toEqual(expectedHealthyResponse);
    });

    test('Bad input - response should be "Bad Request"', async () => {
        mockedDocumentStorageRepository.defaultInstance.updateDocumemt.mockResolvedValue(true);

        const requestParams: updateDocumentParameters = {
            arn: 'BadARN',
            document: ""
        };
        const response = await updateDocument(requestParams, defaultContext);

        const expectedBadResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Please Check the ARN of the Document',
        });

        expect(DocumentStorageRepository.defaultInstance.getDocumentByArn).toBeCalledWith(
            requestParams.arn
        );
        expect(response).toEqual(expectedBadResponse);
    });

    test('Service Error - should throw', async () => {
        mockedDocumentStorageRepository.defaultInstance.updateDocumemt.mockResolvedValue(false);
        const requestParams = {
            arn: 'GoodARN',
            document: ""
        };
        const response = await updateDocument(requestParams, defaultContext);

        const expectedBadResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Imposible to Update Document',
        });

        expect(DocumentStorageRepository.defaultInstance.getDocumentByArn).toBeCalledWith(
            requestParams.arn
        );
        expect(response).toEqual(expectedBadResponse);
    });
});

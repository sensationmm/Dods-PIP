import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { DocumentStorageRepository } from '../../../src/repositories/';
import { getDocument } from '../../../src/handlers/getDocument/getDocument';
import { mocked } from 'ts-jest/utils';

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

const FUNCTION_NAME = getDocument.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be "healthy"', async () => {
        const requestParams = {
            arn: 'GoodARN',
        };
        const response = await getDocument(requestParams, defaultContext);

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Document found.',
            payload: documentPayload,
        });

        expect(DocumentStorageRepository.defaultInstance.getDocumentByArn).toBeCalledWith(
            requestParams.arn
        );
        expect(response).toEqual(expectedHealthyResponse);
    });

    test('Bad input - response should be "Bad Request"', async () => {
        const requestParams = {
            arn: 'BadARN',
        };
        const response = await getDocument(requestParams, defaultContext);

        const expectedBadResponse = new HttpResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, {
            success: false,
            message: 'Error retrieving document.',
        });

        expect(DocumentStorageRepository.defaultInstance.getDocumentByArn).toBeCalledWith(
            requestParams.arn
        );
        expect(response).toEqual(expectedBadResponse);
    });

    test('Service Error - should throw', async () => {
        const requestParams = {
            arn: 'serviceError',
        };
        try {
            await getDocument(requestParams, defaultContext);
            expect(true).toBe(false);
        } catch (e) {
            expect(e).toHaveProperty('message', 'Generic Error');
        }
    });
});

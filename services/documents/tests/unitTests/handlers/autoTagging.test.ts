import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

//import { DocumentRepository } from '@dodsgroup/dods-repositories';
import { DocumentStorageRepository } from '../../../src/repositories/';
import { autoTagging } from '../../../src/handlers/autoTagging/autoTagging';
import { mocked } from 'ts-jest/utils';

const defaultContext = createContext();

jest.mock('../../../src/repositories/DocumentStorageRepository');

const mockedDocumentStorageRepository = mocked(DocumentStorageRepository, true);

const autoTagResponse = {
    Payload: JSON.stringify({
        content: 'content info',
        taxonomyTerms: []
    })
}


mockedDocumentStorageRepository.defaultInstance.autoTagContent.mockResolvedValueOnce(autoTagResponse)

const FUNCTION_NAME = autoTagging.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be "healthy"', async () => {

        const requestParams = {
            content: 'this is the content test'
        };
        const response = await autoTagging(requestParams, defaultContext);

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Content successfully autotagged',
            payload: JSON.parse(autoTagResponse.Payload),
        });

        expect(response).toEqual(expectedHealthyResponse);
    });

});

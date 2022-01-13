import { mocked } from 'jest-mock';
import { CollectionError, createContext, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionsRepository, DeleteCollectionInput } from '@dodsgroup/dods-repositories';
import { deleteCollection } from '../../../src/handlers/deleteCollection/deleteCollection';

const FUNCTION_NAME = deleteCollection.name;

const defaultContext = createContext();

jest.mock('@dodsgroup/dods-repositories');

const mockedCollectionRepository = mocked(CollectionsRepository, true);

describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid Input', async () => {

        const requestParams: DeleteCollectionInput = { collectionId: '94a57103-3bf0-4a29-bdba-99a4650c1849' };

        const defaultDeleteCollectionRepositoryResponse = true;

        mockedCollectionRepository.defaultInstance.delete.mockResolvedValue(defaultDeleteCollectionRepositoryResponse);

        const response = await deleteCollection(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Collection was deleted succesfully',
        });

        expect(response).toEqual(expectedResponse)
    });

    it('Invalid Input', async () => {
        const requestParams: DeleteCollectionInput = { collectionId: '94a57103-3bf0-4a29-bdba-99a4650c1849' };

        const defaultDeleteCollectionRepositoryResponse = new CollectionError('Collection not found');

        mockedCollectionRepository.defaultInstance.delete.mockRejectedValue(defaultDeleteCollectionRepositoryResponse);

        try {
            await deleteCollection(requestParams, defaultContext);

            throw new Error('Code never should come in this point')
        } catch (error: any) {
            expect(error).toEqual(defaultDeleteCollectionRepositoryResponse);
        }
    });
});
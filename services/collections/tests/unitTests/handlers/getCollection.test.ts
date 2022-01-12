import { mocked } from 'jest-mock';
import { CollectionError, createContext, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionsRepository, GetCollectionInput, GetCollectionOutput } from '@dodsgroup/dods-repositories';
import { getCollection } from '../../../src/handlers/getCollection/getCollection';

const FUNCTION_NAME = getCollection.name;

const defaultContext = createContext();

jest.mock('@dodsgroup/dods-repositories');

const mockedCollectionRepository = mocked(CollectionsRepository, true);

describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid Input', async () => {

        const requestParams: GetCollectionInput = { collectionId: '94a57103-3bf0-4a29-bdba-99a4650c1849' };

        const defaultGetCollectionRepositoryResponse: GetCollectionOutput = {
            data: {
                uuid: expect.any(String),
                name: expect.any(String),
                clientAccount: {
                    uuid: expect.any(String),
                    name: expect.any(String),
                },
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
                alertsCount: expect.any(Number),
                queriesCount: expect.any(Number),
                documentsCount: expect.any(Number),
            }
        };

        mockedCollectionRepository.defaultInstance.get.mockResolvedValue(defaultGetCollectionRepositoryResponse);

        const response = await getCollection(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Collection found',
            ...defaultGetCollectionRepositoryResponse,
        });

        expect(response).toEqual(expectedResponse);
    });

    it('Invalid Input', async () => {
        const requestParams: GetCollectionInput = { collectionId: '94a57103-3bf0-4a29-bdba-99a4650c1849' };

        const defaultGetCollectionRepositoryResponse = new CollectionError('Collection not found');

        mockedCollectionRepository.defaultInstance.get.mockRejectedValue(defaultGetCollectionRepositoryResponse);

        try {
            await getCollection(requestParams, defaultContext);
            throw new Error('Code never should come in this point');
        } catch (error: any) {
            expect(error).toEqual(defaultGetCollectionRepositoryResponse);
        }
    });
});
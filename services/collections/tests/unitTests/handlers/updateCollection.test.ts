import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { CollectionRepository } from '../../../src/repositories/CollectionRepository';
import { mocked } from 'jest-mock';
import { updateCollection } from '../../../src/handlers/updateCollection/updateCollection';

const defaultContext = createContext();

const defaultUpdatedCollection: any = {
    uuid: 'newUUID',
    name: 'Test Collection',
    isActive: true,
    clientAccount: {
        uuid: 'clientUUID',
        name: 'Test',
    },
    createdBy: {
        uuid: 'userUUID',
        fullName: 'Test',
    },
    createdAt: new Date('2021-12-29T19:31:38.000Z'),
    updatedAt: new Date('2021-12-29T19:31:38.000Z'),
};

jest.mock('../../../src/repositories/CollectionRepository');

const mockedCollectionRepository = mocked(CollectionRepository, true);

mockedCollectionRepository.defaultInstance.updateCollection.mockResolvedValue(
    defaultUpdatedCollection
);

const FUNCTION_NAME = updateCollection.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be "healthy"', async () => {
        const requestParams = {
            collectionId: 'collectionId',
            name: 'Test Collection',
        };
        const response = await updateCollection(requestParams, defaultContext);

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Collection updated successfully',
            data:
                CollectionRepository.defaultInstance.mapCollection(defaultUpdatedCollection),
        });

        expect(CollectionRepository.defaultInstance.updateCollection).toBeCalledWith({
            ...requestParams,
        });
        expect(response).toEqual(expectedHealthyResponse);
    });

    test('Bad input - response should be "Bad Request"', async () => {
        const requestParams = {
            collectionId: 'badCollectionId',
            name: 'Test Collection',
        };
        mockedCollectionRepository.defaultInstance.updateCollection.mockImplementation(
            () => {
                throw new Error(
                    `Error: could not retrieve Collection with uuid: badCollectionId`,
                );
            }

        );
        const response = await updateCollection(requestParams, defaultContext);

        const expectedBadResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Error: could not retrieve Collection with uuid: badCollectionId',
        });

        expect(CollectionRepository.defaultInstance.updateCollection).toBeCalledWith({
            ...requestParams,
        });
        expect(response).toEqual(expectedBadResponse);

    });
});

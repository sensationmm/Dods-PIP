import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { CollectionRepository } from '../../../src/repositories/CollectionRepository';
import { createCollection } from '../../../src/handlers/createCollection/createCollection';
import { mocked } from 'ts-jest/utils';

const defaultContext = createContext();

const defaultCreatedCollection: any = {
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

mockedCollectionRepository.defaultInstance.createCollection.mockResolvedValue(
    defaultCreatedCollection
);

const FUNCTION_NAME = createCollection.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be "healthy"', async () => {
        const requestParams = {
            clientAccountId: 'clientUUID',
            name: 'Test Collection',
            createdById: 'userUUID',
        };
        const response = await createCollection(requestParams, defaultContext);

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'New Collection created',
            collection:
                CollectionRepository.defaultInstance.mapCollection(defaultCreatedCollection),
        });

        expect(CollectionRepository.defaultInstance.createCollection).toBeCalledWith({
            ...requestParams,
            isActive: true,
        });
        expect(response).toEqual(expectedHealthyResponse);
    });
});

import { Collection, Model } from '@dodsgroup/dods-model';
import { HttpError, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { CollectionRepository } from '../../../src/repositories';
import { mocked } from 'ts-jest/utils';

const defaultCollectionModel: any = {
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
    update: () => defaultCollectionModel,
    reload: () => defaultCollectionModel,
};

const defaultCollectionOutput: any = {
    uuid: 'newUUID',
    name: 'Test Collection',
    isActive: true,
    clientAccount: {
        uuid: 'clientUUID',
        name: 'Test',
    },
    createdBy: {
        uuid: 'userUUID',
        name: 'Test',
    },
    createdAt: new Date('2021-12-29T19:31:38.000Z'),
    updatedAt: new Date('2021-12-29T19:31:38.000Z'),
};

const defaultClientAccount: any = {
    id: 0,
    uuid: 'clientUUID',
    name: 'Test',
};

const defaultUser: any = {
    id: 0,
    uuid: 'userUUID',
    fullName: 'Test',
};

const mockFindOne = async (options: any) => {
    if (options.where.uuid === 'userUUID') {
        return defaultUser;
    }
    if (options.where.uuid === 'clientUUID') {
        return defaultClientAccount;
    }
    if (options.where.uuid === 'collectionUUID') {
        return defaultCollectionModel;
    }
    return null;
};

jest.mock('@dodsgroup/dods-model');

const mockedCollection = mocked(Collection, true);

const mockedFindOne = mocked(Model.findOne);

beforeEach(() => {
    mockedFindOne.mockImplementation(mockFindOne);
    mockedCollection.create.mockResolvedValue(defaultCollectionModel);
});

afterEach(() => {
    mockedFindOne.mockClear();
    mockedCollection.create.mockClear();
});

const CLASS_NAME = CollectionRepository.name;
const CREATE_COLLECTION_NAME = CollectionRepository.defaultInstance.createCollection.name;
const MAP_COLLECTION_NAME = CollectionRepository.defaultInstance.mapCollection.name;
const UPDATE_COLLECTION_NAME = CollectionRepository.defaultInstance.updateCollection.name;

describe(`${CLASS_NAME}.${CREATE_COLLECTION_NAME}`, () => {
    test('Happy case, all parameters', async () => {
        const createCollectionParams = {
            clientAccountId: 'clientUUID',
            name: 'Test Collection',
            createdById: 'userUUID',
            isActive: true,
        };
        const response = await CollectionRepository.defaultInstance.createCollection(
            createCollectionParams
        );
        expect(response).toEqual(defaultCollectionModel);
    });

    test('Invalid clientAccountId, should throw', async () => {
        const createCollectionParams = {
            clientAccountId: 'INVALID',
            name: 'Test Collection',
            createdById: 'userUUID',
            isActive: true,
        };
        try {
            await CollectionRepository.defaultInstance.createCollection(createCollectionParams);
            expect(true).toBe(false);
        } catch (error) {
            expect(error instanceof HttpError).toBe(true);
            expect(error).toHaveProperty(
                'message',
                `Error: Client Account with uuid: ${createCollectionParams.clientAccountId} does not exist`
            );
            expect(error).toHaveProperty('statusCode', HttpStatusCode.BAD_REQUEST);
        }
    });

    test('Invalid createdById, should throw', async () => {
        const createCollectionParams = {
            clientAccountId: 'clientUUID',
            name: 'Test Collection',
            createdById: 'INVALID',
            isActive: true,
        };
        try {
            await CollectionRepository.defaultInstance.createCollection(createCollectionParams);
            expect(true).toBe(false);
        } catch (error) {
            expect(error instanceof HttpError).toBe(true);
            expect(error).toHaveProperty(
                'message',
                `Error: User with uuid: ${createCollectionParams.createdById} does not exist`
            );
            expect(error).toHaveProperty('statusCode', HttpStatusCode.BAD_REQUEST);
        }
    });
});

describe(`${CLASS_NAME}.${MAP_COLLECTION_NAME}`, () => {
    test('Happy case, all parameters', () => {
        const response = CollectionRepository.defaultInstance.mapCollection(defaultCollectionModel);
        expect(response).toEqual(defaultCollectionOutput);
    });

    test('Happy case, no clientAccount and createdBy', () => {
        const { uuid, name, isActive, createdAt, updatedAt } = defaultCollectionModel;
        const incompleteModel: any = { uuid, name, isActive, createdAt, updatedAt };
        const response = CollectionRepository.defaultInstance.mapCollection(incompleteModel);
        expect(response).toEqual(incompleteModel);
    });
});

describe(`${CLASS_NAME}.${UPDATE_COLLECTION_NAME}`, () => {
    test('Happy case, all parameters', async () => {
        const updateCollectionParams = {
            collectionId: 'collectionUUID',
            name: 'Test Collection',
        };
        const response = await CollectionRepository.defaultInstance.updateCollection(
            updateCollectionParams
        );
        expect(response).toEqual(defaultCollectionModel);
    });

    test('Invalid collectionId, should throw', async () => {
        const updateCollectionParams = {
            collectionId: 'INVALID',
            name: 'Test Collection',
        };
        try {
            await CollectionRepository.defaultInstance.updateCollection(updateCollectionParams);
            expect(true).toBe(false);
        } catch (error) {
            //expect(error instanceof HttpError).toBe(true);
            expect(error).toHaveProperty(
                'message',
                `Error: could not retrieve Collection with uuid: INVALID`
            );
            //expect(error).toHaveProperty('statusCode', HttpStatusCode.BAD_REQUEST);
        }
    });

});
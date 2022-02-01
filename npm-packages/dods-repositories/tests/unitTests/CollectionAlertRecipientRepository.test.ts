import { HttpError, HttpStatusCode } from '@dodsgroup/dods-domain';
import { UserAttributes } from '@dodsgroup/dods-model';
import { UpdateRecipientParameters } from '../../src/CollectionAlertRecipientRepository';
import { CollectionAlertRecipientRepository } from '../../src/CollectionAlertRecipientRepository';

const defaultAlert: any = {
    "id": 12,
    "uuid": "newUUID",
    "title": "here",
    "description": null,
    "collection": {
        "uuid": "newUUID",
        "name": "T"
    },
    "template": undefined,
    "schedule": null,
    "timezone": null,
    "createdBy": {
        "uuid": "newUUID",
        "name": "Joe Myers",
        "emailAddress": "joe@ex.com",
        "isDodsUser": false
    },
    "createdAt": new Date("2022-01-13T16:26:41.000Z"),
    "updatedAt": new Date("2022-01-13T16:26:41.000Z"),
    "updatedBy": undefined,
    "hasKeywordsHighlight": false,
    "isScheduled": false,
    "lastStepCompleted": 1,
    "isPublished": false
};

const defaultCollection: any = {
    "uuid": "408f0c93-6125-45f9-95f9-9cdebe2dd759",
    "name": "Chris Test",
    "clientAccount": {
        "uuid": "cd44bad6-8eeb-4870-abb8-72d297ea7a3e",
        "name": "Company1"
    },
    "createdAt": "2022-01-05T09:14:45.000Z",
    "createdBy": {
        "uuid": "6c16a036-2439-4b78-bf29-8069f4cd6c0b",
        "name": "Joe Myers",
        "emailAddress": "joe@ex.com",
        "isDodsUser": false
    },
    "updatedAt": "2022-01-05T09:14:45.000Z",
    "updatedBy": undefined,
    "alertsCount": 1,
    "queriesCount": 0,
    "documentsCount": 0
};

const defaultUser: UserAttributes = {
    "id": 11,
    "uuid": "b310c3d3-d72d-4a7e-b7b4-2bc8a1066354",
    "roleId": null,
    "firstName": "Joe",
    "lastName": "Mayers",
    "title": null,
    "secondaryEmail": null,
    "telephoneNumber1": null,
    "telephoneNumber2": null,
    "primaryEmail": "joe@ex.com",
    "fullName": "Joe Mayers",
    "isActive": true
}

const defaultUser2: UserAttributes = {
    "id": 12,
    "uuid": "9272d6bd-4f6f-4c9f-867d-1fc7d86c2de9",
    "roleId": null,
    "firstName": "Boba",
    "lastName": "Fett",
    "title": null,
    "secondaryEmail": null,
    "telephoneNumber1": null,
    "telephoneNumber2": null,
    "primaryEmail": "boba.fett@somoglobal.com",
    "fullName": "Boba Fett",
    "isActive": true
}

const defaultRecipient: any = {
    "uuid": "6c16a036-2439-4b78-bf29-8069f4cd6c0b",
    "name": "Joe Myers",
    "emailAddress": "joe@ex.com",
    "clientAccount": {
        "uuid": "a170742a-f84d-40e9-9176-8fd6568149f7",
        "name": "DODS GROUP"
    },
    "isDodsUser": true,
    "isActive": true
};

jest.mock('@dodsgroup/dods-model');

const CLASS_NAME = CollectionAlertRecipientRepository.name;
const UPDATE_RECIPIENT_NAME = CollectionAlertRecipientRepository.defaultInstance.update.name;

let alertModelInstanceMock = {};
let alertRecipientInstanceMock = {};
let userModelInstanceMock = {};
let collectionModelInstanceMock = {};

let repository: CollectionAlertRecipientRepository;

const initializeRepositoryMocks = () => {
    repository = new CollectionAlertRecipientRepository(
        alertRecipientInstanceMock as any,
        alertModelInstanceMock as any,
        collectionModelInstanceMock as any,
        userModelInstanceMock as any,
    )
}

beforeAll(() => {
    initializeRepositoryMocks();
});


// Update Recipient tests
describe(`${CLASS_NAME}.${UPDATE_RECIPIENT_NAME}`, () => {
    const UpdateRecipientParameters: UpdateRecipientParameters = {
        collectionId: 'cd44bad6-8eeb-4870-abb8-72d297ea7a3e',
        alertId: '9dc71771-9ce2-49c0-be02-2f26c94b3408',
        isActive: false,
        updatedBy: 'd33f7495-f597-40c9-8cad-26fe81e7cdb6',
        userId: 'b310c3d3-d72d-4a7e-b7b4-2bc8a1066354'
    };

    test('Happy case, updated successfully', async () => {
        const updatedRecipient = Object.assign(defaultRecipient, {
            update: () => Object.assign(defaultRecipient, { isActive: UpdateRecipientParameters.isActive }),
            reload: () => Object.assign(defaultRecipient, {
                user: {
                    "uuid": "b310c3d3-d72d-4a7e-b7b4-2bc8a1066354",
                    "fullName": "Din Djarin",
                    "primaryEmail": "din.djarin@somoglobal.com",
                    getRole: () => ({
                        "dodsRole": 1
                    })
                }
            }),
        });
        userModelInstanceMock = { findOne: jest.fn().mockResolvedValue(defaultUser).mockResolvedValueOnce(defaultUser2) };
        collectionModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultCollection) };
        alertModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultAlert) };
        alertRecipientInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(updatedRecipient) };
        initializeRepositoryMocks();

        const response = await repository.update(UpdateRecipientParameters);
        expect(response.isActive).toEqual(false);
        expect(response.emailAddress).toEqual("din.djarin@somoglobal.com");
    });

    test('Update by not found / Inactive', async () => {
        userModelInstanceMock = { findOne: jest.fn().mockResolvedValue(undefined).mockResolvedValueOnce(defaultUser2) };
        collectionModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultCollection) };
        alertModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultAlert) };
        alertRecipientInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultRecipient) };
        initializeRepositoryMocks();

        try {
            await repository.update(UpdateRecipientParameters);
        } catch (error) {
            expect(error instanceof HttpError).toBe(true);
            expect(error).toHaveProperty(
                'message',
                `Unable to retrieve User with uuid: ${UpdateRecipientParameters.updatedBy}`
            );
            expect(error).toHaveProperty('statusCode', HttpStatusCode.NOT_FOUND);
        }
    });

    test('User target not found / Inactive', async () => {
        userModelInstanceMock = { findOne: jest.fn().mockResolvedValue(defaultUser).mockResolvedValueOnce(undefined) };
        collectionModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultCollection) };
        alertModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultAlert) };
        alertRecipientInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultRecipient) };
        initializeRepositoryMocks();

        try {
            await repository.update(UpdateRecipientParameters);
        } catch (error) {
            expect(error instanceof HttpError).toBe(true);
            expect(error).toHaveProperty(
                'message',
                `Unable to retrieve User with uuid: ${UpdateRecipientParameters.userId}`
            );
            expect(error).toHaveProperty('statusCode', HttpStatusCode.NOT_FOUND);
        }
    });

    test('Collection not found / Inactive', async () => {
        userModelInstanceMock = { findOne: jest.fn().mockResolvedValue(defaultUser).mockResolvedValueOnce(defaultUser2) };
        collectionModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(undefined) };
        alertModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultAlert) };
        alertRecipientInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultRecipient) };
        initializeRepositoryMocks();

        try {
            await repository.update(UpdateRecipientParameters);
        } catch (error) {
            expect(error instanceof HttpError).toBe(true);
            expect(error).toHaveProperty(
                'message',
                `Unable to retrieve Collection with uuid: ${UpdateRecipientParameters.collectionId}`
            );
            expect(error).toHaveProperty('statusCode', HttpStatusCode.NOT_FOUND);
        }
    });

    test('Alert not found / Inactive', async () => {
        userModelInstanceMock = { findOne: jest.fn().mockResolvedValue(defaultUser).mockResolvedValueOnce(defaultUser2) };
        collectionModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultCollection) };
        alertModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(undefined) };
        alertRecipientInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultRecipient) };
        initializeRepositoryMocks();

        try {
            await repository.update(UpdateRecipientParameters);
        } catch (error) {
            expect(error instanceof HttpError).toBe(true);
            expect(error).toHaveProperty(
                'message',
                `Unable to retrieve Alert with uuid: ${UpdateRecipientParameters.alertId} or doesn't belong to collection with uuid: ${UpdateRecipientParameters.collectionId}`
            );
            expect(error).toHaveProperty('statusCode', HttpStatusCode.NOT_FOUND);
        }
    });

    test('Recipient not found / Invalid params', async () => {
        userModelInstanceMock = { findOne: jest.fn().mockResolvedValue(defaultUser).mockResolvedValueOnce(defaultUser2) };
        collectionModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultCollection) };
        alertModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultAlert) };
        alertRecipientInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(undefined) };
        initializeRepositoryMocks();

        try {
            await repository.update(UpdateRecipientParameters);
        } catch (error) {
            expect(error instanceof HttpError).toBe(true);
            expect(error).toHaveProperty(
                'message',
                `Unable to retrieve Recipient who belongs to alert with uuid: ${UpdateRecipientParameters.alertId}`
            );
            expect(error).toHaveProperty('statusCode', HttpStatusCode.NOT_FOUND);
        }
    });
});

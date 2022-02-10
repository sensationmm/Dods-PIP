import { HttpError, HttpStatusCode } from '@dodsgroup/dods-domain';
import { Collection, Model, UserAttributes } from '@dodsgroup/dods-model';
import { mocked } from 'jest-mock';
import { UpdateAlertParameters } from './../../src/CollectionAlertsRepository';
import { CollectionAlertsRepository } from './../../src/CollectionAlertsRepository';

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
    "uuid": "6c16a036-2439-4b78-bf29-8069f4cd6c0b",
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


jest.mock('@dodsgroup/dods-model');

const mockedAlert = mocked(Collection, true);

const mockedFindOne = mocked(Model.findOne);

afterEach(() => {
    mockedFindOne.mockClear();
    mockedAlert.create.mockClear();
});

const CLASS_NAME = CollectionAlertsRepository.name;
const UPDATE_ALERT_NAME = CollectionAlertsRepository.defaultInstance.updateAlert.name;

let alertModelInstanceMock = {};
let alertDocumentModelInstanceMock = {};
let alertQueryModelInstanceMock = {};
let recipientModelInstanceMock = {};
let userModelInstanceMock = {};
let collectionModelInstanceMock = {};

let repository: CollectionAlertsRepository;

const initializeRepositoryMocks = () => {
    repository = new CollectionAlertsRepository(
        alertModelInstanceMock as any,
        collectionModelInstanceMock as any,
        alertDocumentModelInstanceMock as any,
        alertQueryModelInstanceMock as any,
        recipientModelInstanceMock as any,
        userModelInstanceMock as any
    )
}

beforeAll(() => {
    initializeRepositoryMocks();
});


// Update Alert tests
describe(`${CLASS_NAME}.${UPDATE_ALERT_NAME}`, () => {
    const updateAlertParams: UpdateAlertParameters = {
        collectionId: 'cd44bad6-8eeb-4870-abb8-72d297ea7a3e',
        alertId: '9dc71771-9ce2-49c0-be02-2f26c94b3408',
        title: 'Test Alert Updated',
        updatedBy: 'd33f7495-f597-40c9-8cad-26fe81e7cdb6',
    };

    test('Happy case, updated successfully', async () => {
        const updatedAlert = Object.assign(defaultUser, {
            update: () => Object.assign(defaultUser, { title: updateAlertParams.title }),
            reload: () => defaultAlert
        });
        collectionModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultCollection) };
        alertModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(updatedAlert) };
        userModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultUser) };
        initializeRepositoryMocks();

        const response = await repository.updateAlert(updateAlertParams);
        expect(response.title).toEqual("Test Alert Updated");
    });

    test('Collection not found / Inactive', async () => {
        collectionModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(undefined) };
        alertModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultAlert) };
        userModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultUser) };
        initializeRepositoryMocks();

        try {
            await repository.updateAlert(updateAlertParams);
        } catch (error) {
            expect(error instanceof HttpError).toBe(true);
            expect(error).toHaveProperty(
                'message',
                `Unable to retrieve Collection with uuid: ${updateAlertParams.collectionId}`
            );
            expect(error).toHaveProperty('statusCode', HttpStatusCode.NOT_FOUND);
        }
    });

    test('User not found / Inactive', async () => {
        collectionModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultCollection) };
        alertModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultAlert) };
        userModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(undefined) };
        initializeRepositoryMocks();

        try {
            await repository.updateAlert(updateAlertParams);
        } catch (error) {
            expect(error instanceof HttpError).toBe(true);
            expect(error).toHaveProperty(
                'message',
                `Unable to retrieve User with uuid: ${updateAlertParams.updatedBy}`
            );
            expect(error).toHaveProperty('statusCode', HttpStatusCode.NOT_FOUND);
        }
    });

    test('Alert not found / Inactive', async () => {
        collectionModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultCollection) };
        alertModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(undefined) };
        userModelInstanceMock = { findOne: jest.fn().mockResolvedValueOnce(defaultUser) };
        initializeRepositoryMocks();

        try {
            await repository.updateAlert(updateAlertParams);
        } catch (error) {
            expect(error instanceof HttpError).toBe(true);
            expect(error).toHaveProperty(
                'message',
                `Unable to retrieve Alert with uuid: ${updateAlertParams.alertId}`
            );
            expect(error).toHaveProperty('statusCode', HttpStatusCode.NOT_FOUND);
        }
    });

    test('clean_query_strings separates and cleans', async () => {
        const cleaned_string = repository.clean_query_strings('"material of animal origin" OR "3e5a9c5dd27a9a4081c0f95599c8b58e" OR "Garfield"')
        expect(cleaned_string).toHaveLength(3)
        expect(cleaned_string).toEqual(['material of animal origin', '3e5a9c5dd27a9a4081c0f95599c8b58e', 'Garfield'])
    })

});

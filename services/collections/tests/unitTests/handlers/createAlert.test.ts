import { CollectionAlertsRepository, CreateAlertParameters } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { createAlert } from '../../../src/handlers/createAlert/createAlert';
import { mocked } from 'jest-mock';

const mockedCollectionAlertsRepository = mocked(CollectionAlertsRepository, true);

const defaultContext = createContext();

const FUNCTION_NAME = createAlert.name;

jest.mock('@dodsgroup/dods-repositories');

const defaultCreatedAlert: any = {
    uuid: "alertUUID",
    title: "repository",
    description: null,
    collection: {
        uuid: "collectionUUID",
        name: "Collection Name"
    },
    template: {},
    schedule: "",
    timezone: "",
    createdBy: {
        uuid: "userUUID",
        name: "Joe Myers",
        emailAddress: "joe@ex.com"
    },
    createdAt: new Date('2021-12-29T19:31:38.000Z'),
    updatedAt: new Date('2021-12-29T19:31:38.000Z'),
    lastStepCompleted: 1,
    isPublished: 0,
    updatedById: {}
};

const defaultCreatedQuery: any = {

};

describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid input', async () => {

        const requestParams: CreateAlertParameters = {
            collectionId: '94a57103-3bf0-4a29-bdba-99a4650c1849',
            title: "repository",
            alertQueries: [{
                query: "in dods",
                informationTypes: "infoTypes",
                contentSources: "Source"
            },
            ],
            createdBy: "6c16a036-2439-4b78-bf29-8069f4cd6c0b"

        };


        mockedCollectionAlertsRepository.defaultInstance.createAlert.mockResolvedValue(defaultCreatedAlert);
        mockedCollectionAlertsRepository.defaultInstance.createQuery.mockResolvedValue(defaultCreatedQuery);


        const response = await createAlert(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Alert created successfully in step 1',
        });

        expect(response).toEqual(expectedResponse);
    });


});
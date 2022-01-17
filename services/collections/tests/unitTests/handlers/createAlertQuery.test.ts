import { CollectionAlertsRepository, CreateAlertQueryParameters } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { createAlertQuery } from '../../../src/handlers/createAlertQuery/createAlertQuery';
import { mocked } from 'jest-mock';

const mockedCollectionAlertsRepository = mocked(CollectionAlertsRepository, true);

const defaultContext = createContext();

const FUNCTION_NAME = createAlertQuery.name;

jest.mock('@dodsgroup/dods-repositories');

const defaultCreatedAlertQuery: any = {
    uuid: "alertQueryUUID",
    name: "repository",
    informationTypes: "informationTypes",
    alert: {
        uuid: "collectionUUID",
        title: "Collection Name"
    },
    contentSources: "",
    createdBy: {
        uuid: "userUUID",
        name: "Joe Myers",
        emailAddress: "joe@ex.com"
    },
    createdAt: new Date('2021-12-29T19:31:38.000Z'),
    updatedAt: new Date('2021-12-29T19:31:38.000Z'),
    query: "queryString",

};



describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid input', async () => {

        const requestParams: CreateAlertQueryParameters = {
            alertId: "54b71631-5419-452a-a838-284c268889ea",
            informationTypes: "test1",
            contentSources: "test1",
            query: "test1",
            createdBy: "6340c08f-0a01-41c1-8434-421f1fff3d1e"

        };

        mockedCollectionAlertsRepository.defaultInstance.createQuery.mockResolvedValue(defaultCreatedAlertQuery);

        const response = await createAlertQuery(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Alert query created successfully',
            query: defaultCreatedAlertQuery
        });

        expect(response).toEqual(expectedResponse);
    });


});
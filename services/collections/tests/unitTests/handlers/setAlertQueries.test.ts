import { CollectionAlertsRepository, SetAlertQueriesParameters } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { mocked } from 'jest-mock';
import { setAlertQueries } from '../../../src/handlers/setAlertQueries/setAlertQueries';

const mockedCollectionAlertsRepository = mocked(CollectionAlertsRepository, true);

const defaultContext = createContext();

const FUNCTION_NAME = setAlertQueries.name;

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

const defaultObjResponse: any = {
    alert: defaultCreatedAlert,
    queries: [{}, {}]

}


describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid input', async () => {

        const requestParams: SetAlertQueriesParameters = {
            collectionId: "collection-uuid",
            alertId: "alert-uuid",
            alertQueries: [{
                query: "2ndo time",
                informationTypes: "string",
                contentSources: "string",
            },
            ],
            updatedBy: "6c16a036-2439-4b78-bf29-8069f4cd6c0b"
        };


        mockedCollectionAlertsRepository.defaultInstance.setAlertQueries.mockResolvedValue(defaultObjResponse);


        const response = await setAlertQueries(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Alert updated successfully in step 1',
            alert: { ...defaultCreatedAlert, queries: [{}, {}] }
        });

        expect(response).toEqual(expectedResponse);
    });


});
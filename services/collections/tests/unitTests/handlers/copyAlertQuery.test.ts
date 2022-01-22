import { CollectionAlertsRepository, CopyQueryParameters } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { copyAlertQuery } from '../../../src/handlers/copyAlertQuery/copyAlertQuery';
import { mocked } from 'jest-mock';

copyAlertQuery;

const mockedCollectionAlertsRepository = mocked(CollectionAlertsRepository, true);

const defaultContext = createContext();

const FUNCTION_NAME = copyAlertQuery.name;

jest.mock('@dodsgroup/dods-repositories');

const defaultCreatedAlertQuery: any = {
    uuid: 'alertQueryUUID',
    name: 'repository',
    informationTypes: 'informationTypes',
    alert: {
        uuid: 'collectionUUID',
        title: 'Collection Name',
    },
    contentSources: '',
    createdBy: {
        uuid: 'userUUID',
        name: 'Joe Myers',
        emailAddress: 'joe@ex.com',
    },
    createdAt: new Date('2021-12-29T19:31:38.000Z'),
    updatedAt: new Date('2021-12-29T19:31:38.000Z'),
    query: 'queryString',
};

describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid input', async () => {
        const requestParams: CopyQueryParameters = {
            queryId: 'alertQueryUUID',
            destinationAlertId: 'alertUUID',
            createdBy: '6340c08f-0a01-41c1-8434-421f1fff3d1e',
        };

        mockedCollectionAlertsRepository.defaultInstance.copyQuery.mockResolvedValue(
            defaultCreatedAlertQuery
        );

        const response = await copyAlertQuery(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Alert Query copied successfully',
            query: defaultCreatedAlertQuery,
        });

        expect(response).toEqual(expectedResponse);
    });
});

import {
    CollectionAlertsRepository,
    DeleteAlertQueryParameters,
} from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { deleteAlertQuery } from '../../../src/handlers/deleteAlertQuery/deleteAlertQuery';
import { mocked } from 'jest-mock';

const FUNCTION_NAME = deleteAlertQuery.name;
const defaultContext = createContext();
jest.mock('@dodsgroup/dods-repositories');
const mockedCollectionAlertsRepository = mocked(CollectionAlertsRepository, true);

describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid Input', async () => {
        const requestParams: DeleteAlertQueryParameters = {
            collectionId: 'collectionUUID',
            alertId: 'alertUUID',
            queryId: 'queryUUID',
        };

        mockedCollectionAlertsRepository.defaultInstance.deleteAlertQuery.mockResolvedValue();

        const response = await deleteAlertQuery(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Query was deleted successfully',
        });

        expect(response).toEqual(expectedResponse);
        expect(
            mockedCollectionAlertsRepository.defaultInstance.deleteAlertQuery
        ).toHaveBeenCalledWith(requestParams);
    });
});

import { CollectionAlertsRepository, SearchAlertQueriesParameters, getQueriesResponse } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { getAlertQueries } from '../../../src/handlers/getAlertQueries/getAlertQueries';
import { mocked } from 'jest-mock';

const mockedCollectionAlertsRepository = mocked(CollectionAlertsRepository, true);

const defaultContext = createContext();

const FUNCTION_NAME = getAlertQueries.name;

jest.mock('@dodsgroup/dods-repositories');

describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid input', async () => {

        const requestParams: SearchAlertQueriesParameters = {
            alertId: '94a57103-3bf0-4a29-bdba-99a4650c1849',
            limit: '30',
            offset: '0',
            sortDirection: 'ASC'
        };

        const defaultSearchQueriesRepositoryResponse: getQueriesResponse = {
            count: 0,
            queries: []
        };

        mockedCollectionAlertsRepository.defaultInstance.getAlertQueries.mockResolvedValue(defaultSearchQueriesRepositoryResponse)

        const response = await getAlertQueries(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Alert queries found',
            limit: requestParams.limit,
            offset: requestParams.offset,
            totalRecords: defaultSearchQueriesRepositoryResponse.count,
            queries: defaultSearchQueriesRepositoryResponse.queries
        })

        expect(response).toEqual(expectedResponse);

        expect(mockedCollectionAlertsRepository.defaultInstance.getAlertQueries).toHaveBeenCalledTimes(1);

        expect(mockedCollectionAlertsRepository.defaultInstance.getAlertQueries).toHaveBeenCalledWith(requestParams);
    });

    it('Valid input extra parameters', async () => {

        const requestParams: SearchAlertQueriesParameters = {
            alertId: '94a57103-3bf0-4a29-bdba-99a4650c1849',
        };

        const defaultSearchQueriesRepositoryResponse: getQueriesResponse = {
            count: 0,
            queries: []
        };

        mockedCollectionAlertsRepository.defaultInstance.getAlertQueries.mockResolvedValue(defaultSearchQueriesRepositoryResponse)

        const response = await getAlertQueries(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Alert queries found',
            limit: requestParams.limit,
            offset: requestParams.offset,
            totalRecords: defaultSearchQueriesRepositoryResponse.count,
            queries: defaultSearchQueriesRepositoryResponse.queries
        })

        expect(response).toEqual(expectedResponse);

    });

});
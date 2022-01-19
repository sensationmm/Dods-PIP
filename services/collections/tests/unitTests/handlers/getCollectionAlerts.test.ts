import { CollectionAlertQuery, CollectionAlertRecipient } from '@dodsgroup/dods-model';
import { CollectionAlertsRepository, SearchCollectionAlertsParameters, getAlertsByCollectionResponse } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { getCollectionAlerts } from '../../../src/handlers/getCollectionAlerts/getCollectionAlerts';
import { mocked } from 'jest-mock';

const mockedCollectionAlertsRepository = mocked(CollectionAlertsRepository, true);

const defaultContext = createContext();

const FUNCTION_NAME = getCollectionAlerts.name;

jest.mock('@dodsgroup/dods-repositories');

describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid input', async () => {
        const requestParams: SearchCollectionAlertsParameters = {
            collectionId: '94a57103-3bf0-4a29-bdba-99a4650c1849',
            limit: '30',
            offset: '0',
        };

        const defaultSearchCollectionsRepositoryResponse: getAlertsByCollectionResponse = {
            count: 0,
            alerts: [],
        };
        const querysByAlert: Array<CollectionAlertQuery> = [] as Array<CollectionAlertQuery>;
        const recipientsByAlert = [] as Array<CollectionAlertRecipient>;

        mockedCollectionAlertsRepository.defaultInstance.getCollectionAlerts.mockResolvedValue({
            count: 0,
            alerts: [],
        });
        mockedCollectionAlertsRepository.defaultInstance.getQueriesByAlert.mockResolvedValue(
            querysByAlert
        );
        mockedCollectionAlertsRepository.defaultInstance.getRecipientsByAlert.mockResolvedValue(
            recipientsByAlert
        );

        const response = await getCollectionAlerts(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Collection alerts found',
            limit: requestParams.limit,
            offset: requestParams.offset,
            totalRecords: 0,
            alerts: defaultSearchCollectionsRepositoryResponse.alerts,
        });

        expect(response).toEqual(expectedResponse);

        expect(
            mockedCollectionAlertsRepository.defaultInstance.getCollectionAlerts
        ).toHaveBeenCalledTimes(1);

        expect(
            mockedCollectionAlertsRepository.defaultInstance.getCollectionAlerts
        ).toHaveBeenCalledWith(requestParams);
    });

    it('Valid input extra values', async () => {
        const requestParams: SearchCollectionAlertsParameters = {
            collectionId: '94a57103-3bf0-4a29-bdba-99a4650c1849',
            limit: '30',
            offset: '0',
        };

        const defaultSearchCollectionsRepositoryResponse: getAlertsByCollectionResponse = {
            count: 0,
            alerts: [{ searchQueriesCount: 2, recipientsCount: 2 }],
        };
        const querysByAlert = [
            { name: 'query1', alertId: 1 },
            { name: 'query2', alertId: 1 },
        ] as Array<CollectionAlertQuery>;
        const recipientsByAlert = [
            { alertId: 1 },
            { alertId: 1 },
        ] as Array<CollectionAlertRecipient>;

        mockedCollectionAlertsRepository.defaultInstance.getCollectionAlerts.mockResolvedValue({
            count: 0,
            alerts: [{ id: 1 }],
        });
        mockedCollectionAlertsRepository.defaultInstance.getQueriesByAlert.mockResolvedValue(
            querysByAlert
        );
        mockedCollectionAlertsRepository.defaultInstance.getRecipientsByAlert.mockResolvedValue(
            recipientsByAlert
        );

        const response = await getCollectionAlerts(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Collection alerts found',
            limit: requestParams.limit,
            offset: requestParams.offset,
            totalRecords: 0,
            alerts: defaultSearchCollectionsRepositoryResponse.alerts,
        });

        expect(response).toEqual(expectedResponse);
    });

    it('Invalid collection Id', async () => {

        const requestParams: any = {
            collectionId: 'inactiveCollection',
            //limit: '30',
            //offset: '0',
        };


        mockedCollectionAlertsRepository.defaultInstance.getCollectionAlerts.mockImplementation(
            () => {
                throw new Error(
                    `Error: could not retrieve Collection with uuid: badCollectionId`,
                );
            }

        );

        const response = await getCollectionAlerts(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.NOT_FOUND, {
            success: false,
            message: 'Collection does not exist',
        });

        expect(response).toEqual(expectedResponse);

    });
});
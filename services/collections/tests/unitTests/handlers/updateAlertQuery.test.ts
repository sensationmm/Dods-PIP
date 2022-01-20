import { AlertQueryResponse, CollectionAlertsRepository, UpdateAlertQuery } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { mocked } from 'jest-mock';
import { updateAlertQuery } from '../../../src/handlers/updateAlertQuery/updateAlertQuery';

const mockedCollectionAlertsRepository = mocked(CollectionAlertsRepository, true);

const defaultContext = createContext();

const FUNCTION_NAME = updateAlertQuery.name;

jest.mock('@dodsgroup/dods-repositories');

describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid input', async () => {

        const requestParams: UpdateAlertQuery = {
            collectionId: '94a57103-3bf0-4a29-bdba-99a4650c1849',
            updatedBy: 'user-uuid',
            alertId: 'alert-uuid',
            queryId: 'query -uuid',
            contentSources: 'contentSources',
            informationTypes: 'infoTypes',
            query: 'qeury'
        };

        mockedCollectionAlertsRepository.defaultInstance.updateAlertQuery.mockResolvedValue({} as AlertQueryResponse);


        const response = await updateAlertQuery(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Alert query was updated successfully',
            query: {}

        });

        expect(response).toEqual(expectedResponse);

        expect(mockedCollectionAlertsRepository.defaultInstance.updateAlertQuery).toHaveBeenCalledTimes(1);

        expect(mockedCollectionAlertsRepository.defaultInstance.updateAlertQuery).toHaveBeenCalledWith(requestParams);
    });


});
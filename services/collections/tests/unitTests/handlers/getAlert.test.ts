import {
    AlertByIdOutput,
    CollectionAlertsRepository,
    SearchAlertParameters,
} from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { getAlert } from '../../../src/handlers/getAlert/getAlert';
import { mocked } from 'jest-mock';

const FUNCTION_NAME = getAlert.name;
const defaultContext = createContext();
jest.mock('@dodsgroup/dods-repositories');
const mockedCollectionAlertsRepository = mocked(CollectionAlertsRepository, true);

const answerMock: AlertByIdOutput = {
    searchQueriesCount: 1,
    recipientsCount: 2,
    alert: {
        id: 2,
        uuid: '59648fe0-534b-4b3b-9214-6bf57b0cdd56',
        title: 'My alert',
        description: 'Only testing',
        collection: {
            uuid: '350b159c-6e43-11ec-90d6-0242ac120003',
            name: 'Test collection',
        },
        template: {
            id: '2',
            name: 'Test Template 2',
        },
        schedule: 'CRON 1',
        timezone: 'UTC-5',
        createdBy: {
            uuid: '6c16a036-2439-4b78-bf29-8069f4cd6c0b',
            name: 'Joe Myers',
            emailAddress: 'joe@ex.com',
        },
        createdAt: new Date(),
        updatedAt: null,
        updatedBy: {},
        hasKeywordsHighlight: true,
        isScheduled: true,
        lastStepCompleted: 1,
        isPublished: true,
    },
};

describe(`${FUNCTION_NAME} handler`, () => {

    it('Valid Input', async () => {
        const requestParams: SearchAlertParameters = {
            collectionId: '350b159c-6e43-11ec-90d6-0242ac120003',
            alertId: '9648fe0-534b-4b3b-9214-6bf57b0cdd56'
        };

        mockedCollectionAlertsRepository.defaultInstance.getAlert.mockResolvedValue(answerMock);

        const response = await getAlert(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'The alert was found',
            alert: {
                ...answerMock.alert,
                searchQueriesCount: answerMock.searchQueriesCount,
                recipientsCount: answerMock.recipientsCount
            }
        });

        expect(response).toEqual(expectedResponse);
        expect(mockedCollectionAlertsRepository.defaultInstance.getAlert).toHaveBeenCalledWith(requestParams);
    });
});

import { CollectionAlertQuery, CollectionAlertRecipient } from '@dodsgroup/dods-model';
import { CollectionAlertsRepository, setAlertScheduleParameters } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { mocked } from 'jest-mock';
import { setAlertSchedule } from '../../../src/handlers/setAlertSchedule/setAlertSchedule';

const mockedCollectionAlertsRepository = mocked(CollectionAlertsRepository, true);

const defaultContext = createContext();

const FUNCTION_NAME = setAlertSchedule.name;

jest.mock('@dodsgroup/dods-repositories');

const defaultSheduleCollection: any = {
    id: 1,
    uuid: 'newUUID',
    isActive: true,
    createdBy: 1,
    collectionId: 1,
    templateId: 1,
    title: 'test title',
    isPublished: false,
    lastStepCompleted: 1,
    isScheduled: true,
    hasKeywordsHighlight: false,
    createdAt: new Date('2021-12-29T19:31:38.000Z'),
    updatedAt: new Date('2021-12-29T19:31:38.000Z'),
};


describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid input', async () => {

        const requestParams: setAlertScheduleParameters = {
            alertId: 'alertUUID',
            collectionId: 'collectionUUD',
            isScheduled: true,
            hasKeywordHighlight: true,
            timezone: "string",
            schedule: "dss",
            updatedBy: "6340c08f-0a01-41c1-8434-421f1fff3d1e",
            alertTemplateId: 1
        };

        const querysByAlert: Array<CollectionAlertQuery> = [] as Array<CollectionAlertQuery>;
        const recipientsByAlert = [] as Array<CollectionAlertRecipient>;
        mockedCollectionAlertsRepository.defaultInstance.mapAlert.mockReturnValue({ id: 1 })
        mockedCollectionAlertsRepository.defaultInstance.setAlertSchedule.mockResolvedValue(defaultSheduleCollection);

        mockedCollectionAlertsRepository.defaultInstance.getQuerysByAlert.mockResolvedValue(querysByAlert);
        mockedCollectionAlertsRepository.defaultInstance.getRecipientsByAlert.mockResolvedValue(recipientsByAlert);

        const response = await setAlertSchedule(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'The alert scheduling was set successfully',
            alert: {
                searchQueriesCount: 0,
                recipientsCount: 0
            }
        });

        expect(response).toEqual(expectedResponse);

    });

});
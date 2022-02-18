import { AlertOutput, CollectionAlertsRepository, DocumentRepository, mapAlert, setAlertScheduleParameters } from '@dodsgroup/dods-repositories';
import { CollectionAlert, CollectionAlertQuery, CollectionAlertRecipient } from '@dodsgroup/dods-model';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { mocked } from 'jest-mock';
import { setAlertSchedule } from '../../../src/handlers/setAlertSchedule/setAlertSchedule';

const mockedCollectionAlertsRepository = mocked(CollectionAlertsRepository, true);
const mockedDocumentRepository = mocked(DocumentRepository, true);
const mockedMapAlert = mocked(mapAlert, true);

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

const answerMock: AlertOutput = {
    "id": 2,
    "uuid": "59648fe0-534b-4b3b-9214-6bf57b0cdd56",
    "title": "My alert",
    "description": "Only testing",
    "collection": {
        "uuid": "350b159c-6e43-11ec-90d6-0242ac120003",
        "name": "Test collection"
    },
    "template": {
        "id": 2,
        "name": "Test Template 2"
    },
    "schedule": "CRON 1",
    "timezone": "UTC-5",
    "createdBy": {
        "uuid": "6c16a036-2439-4b78-bf29-8069f4cd6c0b",
        "name": "Joe Myers",
        "emailAddress": "joe@ex.com",
        "isDodsUser": false
    },
    "createdAt": new Date(),
    "updatedAt": null,
    "updatedBy": undefined,
    "hasKeywordsHighlight": true,
    "isScheduled": true,
    "lastStepCompleted": 1,
    "isPublished": true,
};


describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid input', async () => {

        const requestParams: setAlertScheduleParameters = {
            alertId: 'alertUUID',
            collectionId: 'collectionUUD',
            isScheduled: true,
            hasKeywordHighlight: true,
            timezone: "string",
            schedule: "0 0 13,14,15,16,17,18 ? * MON,TUE,WED,THU,FRI *",
            updatedBy: "6340c08f-0a01-41c1-8434-421f1fff3d1e",
            alertTemplateId: 1
        };

        const querysByAlert: Array<CollectionAlertQuery> = [] as Array<CollectionAlertQuery>;
        const recipientsByAlert = [] as Array<CollectionAlertRecipient>;
        mockedMapAlert.mockReturnValue(new Promise((resolve, _reject) => {
            resolve(answerMock)
        }));
        mockedCollectionAlertsRepository.defaultInstance.setAlertSchedule.mockResolvedValue(defaultSheduleCollection);

        mockedCollectionAlertsRepository.defaultInstance.getQueriesByAlert.mockResolvedValue(
            querysByAlert
        );
        mockedCollectionAlertsRepository.defaultInstance.getRecipientsByAlert.mockResolvedValue(recipientsByAlert);
        mockedDocumentRepository.defaultInstance.scheduleAlertWebhook.mockResolvedValue({ success: true });


        const response = await setAlertSchedule(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'The alert scheduling was set successfully',
            alert: answerMock
        });

        expect(response).toEqual(expectedResponse);

    });

    it('Valid input not scheduled', async () => {

        const requestParams: setAlertScheduleParameters = {
            alertId: 'alertUUID',
            collectionId: 'collectionUUD',
            isScheduled: false,
            hasKeywordHighlight: true,
            timezone: "string",
            schedule: "0 0 13,14,15,16,17,18 ? * MON,TUE,WED,THU,FRI *",
            updatedBy: "6340c08f-0a01-41c1-8434-421f1fff3d1e",
            alertTemplateId: 1
        };

        const querysByAlert: Array<CollectionAlertQuery> = [] as Array<CollectionAlertQuery>;
        const recipientsByAlert = [] as Array<CollectionAlertRecipient>;
        mockedMapAlert.mockReturnValue(new Promise((resolve, _reject) => {
            resolve(answerMock)
        }));
        const alertResponse = {
            elasticQuery: '{"query":{}}',
            isPublished: true
        } as CollectionAlert;
        mockedCollectionAlertsRepository.defaultInstance.validateSchedule.mockResolvedValue(alertResponse);
        mockedCollectionAlertsRepository.defaultInstance.setAlertSchedule.mockResolvedValue(defaultSheduleCollection);
        mockedCollectionAlertsRepository.defaultInstance.getQueriesByAlert.mockResolvedValue(
            querysByAlert
        );
        mockedCollectionAlertsRepository.defaultInstance.getRecipientsByAlert.mockResolvedValue(recipientsByAlert);
        mockedDocumentRepository.defaultInstance.scheduleAlertWebhook.mockResolvedValue({ success: true });


        const response = await setAlertSchedule(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'The alert scheduling was set successfully',
            alert: answerMock
        });

        expect(response).toEqual(expectedResponse);

    });

    it('Valid input not scheduled v2', async () => {

        const requestParams: setAlertScheduleParameters = {
            alertId: 'alertUUID',
            collectionId: 'collectionUUD',
            isScheduled: false,
            hasKeywordHighlight: true,
            timezone: "string",
            schedule: "0 0 13,14,15,16,17,18 ? * MON,TUE,WED,THU,FRI *",
            updatedBy: "6340c08f-0a01-41c1-8434-421f1fff3d1e",
            alertTemplateId: 1
        };

        const querysByAlert: Array<CollectionAlertQuery> = [] as Array<CollectionAlertQuery>;
        const recipientsByAlert = [] as Array<CollectionAlertRecipient>;
        mockedMapAlert.mockReturnValue(new Promise((resolve, _reject) => {
            resolve(answerMock)
        }));
        const alertResponse = {
            elasticQuery: '{"query":{}}',
            isPublished: false
        } as CollectionAlert;
        mockedCollectionAlertsRepository.defaultInstance.validateSchedule.mockResolvedValue(alertResponse);
        mockedCollectionAlertsRepository.defaultInstance.setAlertSchedule.mockResolvedValue(defaultSheduleCollection);
        mockedCollectionAlertsRepository.defaultInstance.getQueriesByAlert.mockResolvedValue(
            querysByAlert
        );
        mockedCollectionAlertsRepository.defaultInstance.getRecipientsByAlert.mockResolvedValue(recipientsByAlert);
        mockedDocumentRepository.defaultInstance.scheduleAlertWebhook.mockResolvedValue({ success: true });


        const response = await setAlertSchedule(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'The alert scheduling was set successfully',
            alert: answerMock
        });

        expect(response).toEqual(expectedResponse);

    });

    it('Valid input not elastic query', async () => {

        const requestParams: setAlertScheduleParameters = {
            alertId: 'alertUUID',
            collectionId: 'collectionUUD',
            isScheduled: false,
            hasKeywordHighlight: true,
            timezone: "string",
            schedule: "0 0 13,14,15,16,17,18 ? * MON,TUE,WED,THU,FRI *",
            updatedBy: "6340c08f-0a01-41c1-8434-421f1fff3d1e",
            alertTemplateId: 1
        };

        const querysByAlert: Array<CollectionAlertQuery> = [] as Array<CollectionAlertQuery>;
        const recipientsByAlert = [] as Array<CollectionAlertRecipient>;
        mockedMapAlert.mockReturnValue(new Promise((resolve, _reject) => {
            resolve(answerMock)
        }));
        const alertResponse = {
            elasticQuery: '',
            isPublished: false
        } as CollectionAlert;
        mockedCollectionAlertsRepository.defaultInstance.validateSchedule.mockResolvedValue(alertResponse);
        mockedCollectionAlertsRepository.defaultInstance.setAlertSchedule.mockResolvedValue(defaultSheduleCollection);
        mockedCollectionAlertsRepository.defaultInstance.getQueriesByAlert.mockResolvedValue(
            querysByAlert
        );
        mockedCollectionAlertsRepository.defaultInstance.getRecipientsByAlert.mockResolvedValue(recipientsByAlert);
        mockedDocumentRepository.defaultInstance.scheduleAlertWebhook.mockResolvedValue({ success: true });


        const response = await setAlertSchedule(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Elastic Query not set',
        });

        expect(response).toEqual(expectedResponse);

    });


});
import { DocumentRepository, EditorialRecordOutput, EditorialRecordRepository } from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { mocked } from 'ts-jest/utils';
import { scheduleEditorialRecord } from '../../../src/handlers/scheduleEditorialRecord/scheduleEditorialRecord';

const defaultContext = createContext();

const defaultUpdatedRecord: any = {
    uuid: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
    documentName: 'NewDocument',
};

const EditorialRecordResponse = {
    status: { status: 'Created' }
} as EditorialRecordOutput;

const EditorialRecordBadResponse = {
    status: { status: 'Scheduled' }
} as EditorialRecordOutput;

jest.mock('@dodsgroup/dods-repositories');

const mockedEditorialRecordRepository = mocked(EditorialRecordRepository, true);
const mockedDocumentPublishRepository = mocked(DocumentRepository, true);

const FUNCTION_NAME = scheduleEditorialRecord.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be "healthy"', async () => {
        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
            cron: '0 0 12 ? * SUN,SAT',
            date: new Date()
        };

        mockedDocumentPublishRepository.defaultInstance.scheduleWebhook.mockResolvedValue({ response: { data: { success: true } } });
        mockedEditorialRecordRepository.defaultInstance.scheduleEditorialRecord.mockResolvedValue(defaultUpdatedRecord);
        mockedEditorialRecordRepository.defaultInstance.getEditorialRecord.mockResolvedValue(EditorialRecordResponse);

        const response = await scheduleEditorialRecord(requestParams, defaultContext);

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'The Document publishing was scheduled successfully',
            editorialRecord: defaultUpdatedRecord,
        });

        expect(response).toEqual(expectedHealthyResponse);
    });

    test('Invalid input - imposible to schedule', async () => {
        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
            cron: '0 0 12 ? * SUN,SAT',
            date: new Date()
        };

        mockedDocumentPublishRepository.defaultInstance.scheduleWebhook.mockResolvedValue({ response: { data: { success: false } } });
        mockedEditorialRecordRepository.defaultInstance.scheduleEditorialRecord.mockResolvedValue(defaultUpdatedRecord);

        const response = await scheduleEditorialRecord(requestParams, defaultContext);

        const expectedBadResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Error could not schedule the public of the document',
        });

        expect(DocumentRepository.defaultInstance.scheduleWebhook).toBeCalledWith(requestParams);
        expect(response).toEqual(expectedBadResponse);
    });

    test('Service Error - should throw', async () => {
        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
            cron: '0 0 12 ? * SUN,SAT',
            date: new Date()
        };


        mockedDocumentPublishRepository.defaultInstance.scheduleWebhook.mockImplementation(() => { throw Error('Generic Error'); });
        mockedEditorialRecordRepository.defaultInstance.scheduleEditorialRecord.mockResolvedValue(defaultUpdatedRecord);

        const response = await scheduleEditorialRecord(requestParams, defaultContext);

        const expectedBadResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Generic Error',
        });
        expect(response).toEqual(expectedBadResponse);

    });

    test('Already Scheduled Editorial Record', async () => {
        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
            cron: '0 0 12 ? * SUN,SAT',
            date: new Date()
        };

        mockedDocumentPublishRepository.defaultInstance.scheduleWebhook.mockResolvedValue({ response: { data: { success: true } } });
        mockedEditorialRecordRepository.defaultInstance.scheduleEditorialRecord.mockResolvedValue(defaultUpdatedRecord);
        mockedEditorialRecordRepository.defaultInstance.getEditorialRecord.mockResolvedValue(EditorialRecordBadResponse);

        const response = await scheduleEditorialRecord(requestParams, defaultContext);

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: `Error: Editorial Record with uuid: ${requestParams.recordId} is already scheduled`
        });

        expect(response).toEqual(expectedHealthyResponse);
    });
});

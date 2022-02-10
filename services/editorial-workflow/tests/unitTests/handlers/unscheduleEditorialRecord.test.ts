import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { DocumentRepository } from '@dodsgroup/dods-repositories';
import { mocked } from 'ts-jest/utils';
import { unscheduleEditorialRecord } from '../../../src/handlers/unscheduleEditorialRecord/unscheduleEditorialRecord';

const defaultContext = createContext();


jest.mock('@dodsgroup/dods-repositories');

const mockedDocumentPublishRepository = mocked(DocumentRepository, true);

const FUNCTION_NAME = unscheduleEditorialRecord.name;

describe(`${FUNCTION_NAME} handler`, () => {

    test('Valid input - response should be "healthy"', async () => {
        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
        };

        mockedDocumentPublishRepository.defaultInstance.deleteSchedule.mockResolvedValue({ response: { data: { success: true } } });

        const response = await unscheduleEditorialRecord(requestParams, defaultContext);

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'The Editorial Record was unscheduled successfully',
        });

        expect(response).toEqual(expectedHealthyResponse);
    });

    test('Bad Response unschedule Editorial Record ', async () => {
        const requestParams = {
            recordId: 'f9d1482a-77e8-440e-a370-7e06fa0da176',
        };

        mockedDocumentPublishRepository.defaultInstance.deleteSchedule.mockResolvedValue({ response: { data: { success: false } } });

        const response = await unscheduleEditorialRecord(requestParams, defaultContext);

        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Not unscheduled Editorial Record',
        });

        expect(response).toEqual(expectedHealthyResponse);
    });


});

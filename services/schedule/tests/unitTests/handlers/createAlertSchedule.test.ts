import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { ScheduleRepository } from "../../../src/repositories/ScheduleRepository";
import { createAlertSchedule } from '../../../src/handlers/createAlertSchedule/createAlertSchedule';
import { createAlertScheduleParameters } from "../../../src/domain";
import { mocked } from 'jest-mock';

const FUNCTION_NAME = createAlertSchedule.name;
const defaultContext = createContext();

jest.mock("../../../src/repositories/ScheduleRepository")
const mockedScheduleRepository = mocked(ScheduleRepository, true)

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be valid', async () => {
        const data: createAlertScheduleParameters = {
            "scheduleId": "1",
            "collectionId": "2",
            "cron": "0 0 13 24 DEC ? 2021"
        }

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            "success": true,
            "message": "Alert schedule created with ID " + data.scheduleId
        });

        mockedScheduleRepository.defaultInstance.createSchedule.mockResolvedValue(true)

        const response = await createAlertSchedule(data, defaultContext);
        expect(response).toEqual(expectedResponse);
    });
});


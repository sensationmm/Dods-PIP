import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { ScheduleRepository } from "../../../src/repositories/ScheduleRepository";
import { createSchedule } from '../../../src/handlers/createSchedule/createSchedule';
import { createScheduleParameters } from "../../../src/domain";
import { mocked } from 'jest-mock';

const FUNCTION_NAME = createSchedule.name;
const defaultContext = createContext();

jest.mock("../../../src/repositories/ScheduleRepository")
const mockedScheduleRepository = mocked(ScheduleRepository, true)

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be valid', async () => {
        const data: createScheduleParameters = {
            "scheduleId": "1",
            "scheduleType": "publish",
            "cron": "0 0 13 24 DEC ? 2021"
        }

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            "success": true,
            "message": "schedule created with ID " + data.scheduleId
        });

        mockedScheduleRepository.defaultInstance.createSchedule.mockResolvedValue(true)

        const response = await createSchedule(data, defaultContext);
        expect(response).toEqual(expectedResponse);
    });
});


import { createSchedule } from '../../../src/handlers/createSchedule/createSchedule';
import {createScheduleParameters} from "../../../src/domain";
import {ScheduleRepository} from "../../../src/repositories/ScheduleRepository";
import { mocked } from 'jest-mock';

import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

const FUNCTION_NAME = createSchedule.name;
const defaultContext = createContext();

jest.mock("../../../src/repositories/ScheduleRepository")
const mockedScheduleRepository = mocked(ScheduleRepository, true)

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be valid', async () => {
        const data: createScheduleParameters = {
            "id": "1",
            "scheduleType": "publishing",
            "cron": "0 0 13 24 DEC ? 2021"
        }

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            "success": true,
            "message": "schedule created with ID " + data.id
        });

        mockedScheduleRepository.defaultInstance.createSchedule.mockResolvedValue(true)

        const response = await createSchedule(data, defaultContext);
        expect(response).toEqual(expectedResponse);
    });
});


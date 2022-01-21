import {deactivateScheduleParameters} from "../../../src/domain";
import {ScheduleRepository} from "../../../src/repositories";
import { mocked } from 'jest-mock';

import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';
import {deactivateSchedule} from "../../../src/handlers/deactivateSchedule/deactivateSchedule";

const FUNCTION_NAME = deactivateSchedule.name;
const defaultContext = createContext();

jest.mock("../../../src/repositories/ScheduleRepository")
const mockedScheduleRepository = mocked(ScheduleRepository, true)

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be valid', async () => {
        const data: deactivateScheduleParameters = {
            "scheduleId": "1"
        }

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            "success": true,
            "message": "schedule with ID " + data.scheduleId + " deactivated"
        });

        mockedScheduleRepository.defaultInstance.deleteSchedule.mockResolvedValue()

        const response = await deactivateSchedule(data, defaultContext);
        expect(response).toEqual(expectedResponse);
    });
});

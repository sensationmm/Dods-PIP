import {updateScheduleParameters} from "../../../src/domain";
import {ScheduleRepository} from "../../../src/repositories/ScheduleRepository";
import { mocked } from 'jest-mock';

import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';
import {updateSchedule} from "../../../src/handlers/updateSchedule/updateSchedule";

const FUNCTION_NAME = updateSchedule.name;
const defaultContext = createContext();

jest.mock("../../../src/repositories/ScheduleRepository")
const mockedScheduleRepository = mocked(ScheduleRepository, true)

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be valid', async () => {
        const data: updateScheduleParameters = {
            id: "1",
            cron: "123"
        }

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            "success": true,
            "message": "schedule with ID " + data.id + " updated"
        });

        mockedScheduleRepository.defaultInstance.updateSchedule.mockResolvedValue()

        const response = await updateSchedule(data, defaultContext);
        expect(response).toEqual(expectedResponse);
    });
});


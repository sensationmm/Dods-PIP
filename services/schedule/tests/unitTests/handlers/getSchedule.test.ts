import {getScheduleParameters} from "../../../src/domain";
import {ScheduleRepository} from "../../../src/repositories/ScheduleRepository";
import { mocked } from 'jest-mock';

import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';
import {getSchedule} from "../../../src/handlers/getSchedule/getSchedule";

const FUNCTION_NAME = getSchedule.name;
const defaultContext = createContext();

jest.mock("../../../src/repositories/ScheduleRepository")
const mockedScheduleRepository = mocked(ScheduleRepository, true)

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be valid', async () => {
        const data: getScheduleParameters = {
            scheduleId: "1"
        }

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            "success": true,
            "message": true
        });

        mockedScheduleRepository.defaultInstance.getSchedule.mockResolvedValue(true)

        const response = await getSchedule(data, defaultContext);
        expect(response).toEqual(expectedResponse);
    });
});

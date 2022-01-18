import {activateScheduleParameters} from "../../../src/domain";
import {ScheduleRepository} from "../../../src/repositories";
import { mocked } from 'jest-mock';

import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';
import {activateSchedule} from "../../../src/handlers/activateSchedule/activateSchedule";

const FUNCTION_NAME = activateSchedule.name;
const defaultContext = createContext();

jest.mock("../../../src/repositories/ScheduleRepository")
const mockedScheduleRepository = mocked(ScheduleRepository, true)

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be valid', async () => {
        const data: activateScheduleParameters = {
            "id": "1"
        }

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            "success": true,
            "message": "schedule with ID " + data.id + " activated"
        });

        mockedScheduleRepository.defaultInstance.deleteSchedule.mockResolvedValue()

        const response = await activateSchedule(data, defaultContext);
        expect(response).toEqual(expectedResponse);
    });
});

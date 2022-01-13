import {deleteScheduleParameters} from "../../../src/domain";
import {ScheduleRepository} from "../../../src/repositories/ScheduleRepository";
import { mocked } from 'jest-mock';

import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';
import {deleteSchedule} from "../../../src/handlers/deleteSchedule/deleteSchedule";

const FUNCTION_NAME = deleteSchedule.name;
const defaultContext = createContext();

jest.mock("../../../src/repositories/ScheduleRepository")
const mockedScheduleRepository = mocked(ScheduleRepository, true)

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be valid', async () => {
        const data: deleteScheduleParameters = {
            "id": "1"
        }

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            "success": true,
            "message": "schedule with ID " + data.id + " deleted"
        });

        mockedScheduleRepository.defaultInstance.deleteSchedule.mockResolvedValue()

        const response = await deleteSchedule(data, defaultContext);
        expect(response).toEqual(expectedResponse);
    });
});


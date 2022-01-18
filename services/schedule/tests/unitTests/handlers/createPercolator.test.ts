import { createPercolatorParameters } from "../../../src/domain";
import {ScheduleRepository} from "../../../src/repositories";
import { mocked } from 'jest-mock';

import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { createPercolator } from "../../../src/handlers/createPercolator/createPercolator";

const FUNCTION_NAME = createPercolator.name;

jest.mock("../../../src/repositories/ScheduleRepository")
const mockedScheduleRepository = mocked(ScheduleRepository, true)
mockedScheduleRepository.defaultInstance.createPercolator.mockResolvedValue(true)

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be valid', async () => {
        const data: createPercolatorParameters = {
            "query": "1"
        }

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            "success": true,
            "message": true
        });

        mockedScheduleRepository.defaultInstance.deleteSchedule.mockResolvedValue()

        const response = await createPercolator(data);
        expect(response).toEqual(expectedResponse);
    });
});

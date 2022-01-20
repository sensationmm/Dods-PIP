import { createPercolatorParameters } from "../../../src/domain";
import { mocked } from 'jest-mock';
import {SearchRepository} from "../../../src/repositories/SearchRepository";

import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { createPercolator } from "../../../src/handlers/createPercolator/createPercolator";


const FUNCTION_NAME = createPercolator.name;

jest.mock("../../../src/repositories/SearchRepository")
const mockedSearchRepository = mocked(SearchRepository, true)
mockedSearchRepository.defaultInstance.createPercolator.mockResolvedValue(true)

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be valid', async () => {
        const data: createPercolatorParameters = {
            "query": "1"
        }

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            "success": true,
            "message": true
        });

        const response = await createPercolator(data);
        expect(response).toEqual(expectedResponse);
    });
});

import { updatePercolatorParameters } from "../../../src/domain";
import { mocked } from 'jest-mock';
import {SearchRepository} from "../../../src/repositories/SearchRepository";

import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { updatePercolator } from "../../../src/handlers/updatePercolator/updatePercolator";

const FUNCTION_NAME = updatePercolator.name;

jest.mock("../../../src/repositories/SearchRepository")
const mockedSearchRepository = mocked(SearchRepository, true)
mockedSearchRepository.defaultInstance.updatePercolator.mockResolvedValue(true)

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be valid', async () => {
        const data: updatePercolatorParameters = {
            "percolatorId": "123",
            "query": "1"
        }

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            "success": true,
            "message": true
        });

        const response = await updatePercolator(data);
        expect(response).toEqual(expectedResponse);
    });
});

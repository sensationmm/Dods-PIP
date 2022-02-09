import { deletePercolatorParameters } from "../../../src/domain";
import { mocked } from 'jest-mock';
import { SearchRepository } from "../../../src/repositories/SearchRepository";

import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import {deletePercolator} from "../../../src/handlers/deletePercolator/deletePercolator";

const FUNCTION_NAME = deletePercolator.name;

jest.mock("../../../src/repositories/SearchRepository")
const mockedSearchRepository = mocked(SearchRepository, true)
mockedSearchRepository.defaultInstance.deletePercolator.mockResolvedValue(true)

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be valid', async () => {
        const data: deletePercolatorParameters = {
            "alertId": "123",
        }

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            "success": true,
            "message": true
        });

        const response = await deletePercolator(data);
        expect(response).toEqual(expectedResponse);
    });
});

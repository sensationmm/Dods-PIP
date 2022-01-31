import { RawQueryParameters } from "../../../src/domain";
import { rawQuery } from "../../../src/handlers/rawQuery/rawQuery";

jest.mock('../../../src/elasticsearch');
jest.mock('../../../src/repositories/SearchRepository');

const FUNCTION_NAME = rawQuery.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('rawQuery valid output on query', async () => {
        const data: RawQueryParameters = { query: {} };

        const response = await rawQuery(data)
        expect(response).not.toEqual(null);
    });
});

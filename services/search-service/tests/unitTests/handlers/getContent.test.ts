import { getContent } from '../../../src/handlers/getContent/getContent';
import {GetContentParameters} from "../../../src/domain";

jest.mock('../../../src/repositories/SearchRepository');

const FUNCTION_NAME = getContent.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('getContent valid output on query', async () => {
        const data: GetContentParameters = { contentId: 'str-uuid' };

        const response = getContent(data)
        expect(response).not.toEqual(null);
    });
});

import { getContent } from '../../../src/handlers/getContent/getContent';
import {GetContentParameters} from "../../../src/domain";
import {SearchRepository} from "../../../src/repositories/SearchRepository";
import { mocked } from 'jest-mock';

jest.mock('../../../src/repositories/SearchRepository');

const FUNCTION_NAME = getContent.name;

const mockedSearchRepository = mocked(SearchRepository, true);

describe(`${FUNCTION_NAME} handler`, () => {
    test('getContent valid output on query', async () => {
        mockedSearchRepository.defaultInstance.getContent.mockResolvedValue({"body": {"hits": {"total": 0}}});
        const data: GetContentParameters = { contentId: 'str-uuid' };

        const response = await getContent(data)
        expect(response).not.toEqual(null);
    });
});

describe(`${FUNCTION_NAME} handler`, () => {
    test('getContent valid output on query with results', async () => {
        mockedSearchRepository.defaultInstance.getContent.mockResolvedValue({"body": {"hits": {"total": {"value": 1}, "hits": [{'_source': ''}]}}});
        const data: GetContentParameters = { contentId: 'str-uuid' };

        const response = await getContent(data)
        expect(response).not.toEqual(null);
    });
});

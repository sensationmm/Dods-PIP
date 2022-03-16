import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { SearchRepository } from "../../../src/repositories/SearchRepository";
import { deleteContent } from '../../../src/handlers/deleteContent/deleteContent'
import { deleteContentParameters } from "../../../src/domain";
import { mocked } from 'jest-mock';

jest.mock('../../../src/repositories/SearchRepository');

const FUNCTION_NAME = deleteContent.name;

const mockedSearchRepository = mocked(SearchRepository, true);

describe(`${FUNCTION_NAME} handler`, () => {

    test('deleteContent valid output on query', async () => {
        mockedSearchRepository.defaultInstance.deleteContent.mockResolvedValue({ "result": "deleted" });
        const data: deleteContentParameters = { contentId: 'str-uuid' };

        const response = await deleteContent(data)


        const expectedHealthyResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Document Deleted',
        });
        expect(response).toEqual(expectedHealthyResponse);
    });

    test(`deleteContent Invalid output on query`, async () => {
        mockedSearchRepository.defaultInstance.deleteContent.mockResolvedValue({ "result": "not_deleted" });
        const data: deleteContentParameters = { contentId: 'str-uuid' };

        const response = await deleteContent(data)


        const expectedBADResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Imposible to delete document',
        });
        expect(response).toEqual(expectedBADResponse);
    });


});



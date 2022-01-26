import {
    CollectionsRepository,
    SearchCollectionsInput,
    SearchCollectionsOutput,
} from '@dodsgroup/dods-repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { mocked } from 'jest-mock';
import { searchCollections } from '../../../src/handlers/searchCollections/searchCollections';

const mockedCollectionRepository = mocked(CollectionsRepository, true);

const defaultContext = createContext();

const FUNCTION_NAME = searchCollections.name;

jest.mock('@dodsgroup/dods-repositories');

afterEach(() => {
    mockedCollectionRepository.defaultInstance.list.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid input, searchTerm', async () => {
        const requestParams: SearchCollectionsInput = {
            clientAccountId: '94a57103-3bf0-4a29-bdba-99a4650c1849',
            sortBy: 'name',
            sortDirection: 'ASC',
            limit: 30,
            offset: 0,
            searchTerm: 'some',
        };

        const defaultSearchCollectionsRepositoryResponse: SearchCollectionsOutput = {
            limit: requestParams.limit,
            offset: requestParams.offset,
            totalRecords: 10,
            filteredRecords: 5,
            data: [],
        };

        mockedCollectionRepository.defaultInstance.list.mockResolvedValue(
            defaultSearchCollectionsRepositoryResponse
        );

        const response = await searchCollections(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Collection List',
            ...defaultSearchCollectionsRepositoryResponse,
        });

        expect(response).toEqual(expectedResponse);

        expect(mockedCollectionRepository.defaultInstance.list).toHaveBeenCalledTimes(1);

        expect(mockedCollectionRepository.defaultInstance.list).toHaveBeenCalledWith(requestParams);
    });

    it('Valid input, startsWith', async () => {
        const requestParams: SearchCollectionsInput = {
            clientAccountId: '94a57103-3bf0-4a29-bdba-99a4650c1849',
            sortBy: 'name',
            sortDirection: 'ASC',
            limit: 30,
            offset: 0,
            startsWith: 'some',
        };

        const defaultSearchCollectionsRepositoryResponse: SearchCollectionsOutput = {
            limit: requestParams.limit,
            offset: requestParams.offset,
            totalRecords: 10,
            filteredRecords: 5,
            data: [],
        };

        mockedCollectionRepository.defaultInstance.list.mockResolvedValue(
            defaultSearchCollectionsRepositoryResponse
        );

        const response = await searchCollections(requestParams, defaultContext);

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Collection List',
            ...defaultSearchCollectionsRepositoryResponse,
        });

        expect(response).toEqual(expectedResponse);

        expect(mockedCollectionRepository.defaultInstance.list).toHaveBeenCalledTimes(1);

        expect(mockedCollectionRepository.defaultInstance.list).toHaveBeenCalledWith(requestParams);
    });

});

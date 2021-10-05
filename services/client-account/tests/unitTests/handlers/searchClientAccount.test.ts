import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { ClientAccountRepository } from '../../../src/repositories';
import { SearchClientAccountParameters } from '../../../src/domain';
import { mocked } from 'ts-jest/utils';
import { searchClientAccount } from '../../../src/handlers/searchClientAccount/searchClientAccount';

const FUNCTION_NAME = searchClientAccount.name;

const SUCCESS_SEARCH_RESPONSE = [
    {
        id: '1dcad502-0c50-4dab-9192-13b5e882b95d',
        name: 'Juan account',
        notes: 'This is the account for Juan.',
        completed: false,
    },
    {
        id: '1dcad502-0c50-4dab-9192-13b5e882b97d',
        name: 'Juan Other account',
        notes: 'This is the account for Juan.',
        completed: false,
    },
];

jest.mock('../../../src/repositories/ClientAccountRepository');

const mockedClientAccountRepository = mocked(ClientAccountRepository, true);

beforeEach(() => {
    mockedClientAccountRepository.defaultInstance.searchClientAccount.mockImplementation(
        async (searchParams: SearchClientAccountParameters) => {
            const { searchTerm } = searchParams;

            if (searchTerm === 'Failed Search') {
                return [];
            }
            if (searchTerm === 'Juan') {
                return SUCCESS_SEARCH_RESPONSE;
            }
        }
    );
});

afterEach(() => {
    mockedClientAccountRepository.defaultInstance.searchClientAccount.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid input`, async () => {
        const searchParams = {
            searchTerm: 'Juan',
            limit: 2,
            offset: 0,
        };

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Showing Results.',
            limit: 2,
            offset: 0,
            data: SUCCESS_SEARCH_RESPONSE,
        });
        // @ts-ignore
        const response = await searchClientAccount(searchParams);

        expect(response).toEqual(expectedResponse);

        expect(
            mockedClientAccountRepository.defaultInstance.searchClientAccount
        ).toHaveBeenCalledTimes(1);
    });

    test(`${FUNCTION_NAME} Invalid input`, async () => {
        const searchParams = {
            searchTerm: 'Failed Search',
            limit: 1,
            offset: 0,
        };

        const expectedResponse = new HttpResponse(HttpStatusCode.NOT_FOUND, {
            success: false,
            message: `No matches found for search parameters: ${searchParams}`,
        });

        // @ts-ignore
        const response: HttpResponse = await searchClientAccount(searchParams);

        expect(response).toEqual(expectedResponse);

        expect(
            mockedClientAccountRepository.defaultInstance.searchClientAccount
        ).toHaveBeenCalledTimes(1);
    });
});

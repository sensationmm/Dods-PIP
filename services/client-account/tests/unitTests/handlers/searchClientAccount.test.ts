import {
    HttpResponse,
    HttpStatusCode,
    createContext,
} from '@dodsgroup/dods-lambda';
import {
    SearchClientAccountParameters,
    SearchClientAccountTotalRecords,
} from '../../../src/domain';

import { ClientAccountRepository } from '../../../src/repositories';
import { mocked } from 'ts-jest/utils';
import { searchClientAccount } from '../../../src/handlers/searchClientAccount/searchClientAccount';

const FUNCTION_NAME = searchClientAccount.name;

const SUCCESS_SEARCH_RESPONSE: SearchClientAccountTotalRecords = {
    totalRecordsModels: 2,
    clientAccountsData: [
        {
            uuid: '1dcad502-0c50-4dab-9192-13b5e882b95d',
            name: 'Juan account',
            notes: 'This is the account for Juan.',
            isCompleted: false,
            lastStepCompleted: 1,
            isUK: false,
            isEU: false,
        },
        {
            uuid: '1dcad502-0c50-4dab-9192-13b5e882b97d',
            name: 'Juan Other account',
            notes: 'This is the account for Juan.',
            isCompleted: false,
            lastStepCompleted: 1,
            isUK: false,
            isEU: false,
        },
    ],
};
jest.mock('../../../src/repositories/ClientAccountRepository');

const mockedClientAccountRepository = mocked(ClientAccountRepository, true);

const defaultContext = createContext();

beforeEach(() => {
    mockedClientAccountRepository.defaultInstance.searchClientAccount.mockImplementation(
        async (searchParams: SearchClientAccountParameters) => {
            const { searchTerm } = searchParams;

            if (searchTerm === 'Failed Search') {
                return { totalRecordsModels: 0, clientAccountsData: [] };
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
            limit: '2',
            offset: '0',
        } as SearchClientAccountParameters;

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Showing Results.',
            limit: 2,
            offset: 0,
            totalRecords: 2,
            data: SUCCESS_SEARCH_RESPONSE.clientAccountsData,
        });

        const response = await searchClientAccount(
            searchParams,
            defaultContext
        );

        expect(response).toEqual(expectedResponse);

        expect(
            mockedClientAccountRepository.defaultInstance.searchClientAccount
        ).toHaveBeenCalledTimes(1);
    });

    test(`${FUNCTION_NAME} Invalid input`, async () => {
        const searchParams = {
            searchTerm: 'Failed Search',
            // limit: '1',
            // offset: '0',
        } as SearchClientAccountParameters;

        const expectedResponse = new HttpResponse(HttpStatusCode.NOT_FOUND, {
            success: false,
            message: `No matches found for search parameters: ${searchParams}`,
        });

        const response = await searchClientAccount(
            searchParams,
            defaultContext
        );

        expect(response).toEqual(expectedResponse);

        expect(
            mockedClientAccountRepository.defaultInstance.searchClientAccount
        ).toHaveBeenCalledTimes(1);
    });
});

import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { ClientAccountRepository } from '../../../src/repositories';
import { checkClientAccountName } from '../../../src/handlers/checkClientAccountName/checkClientAccountName';
import { mocked } from 'ts-jest/utils';

const FUNCTION_NAME = checkClientAccountName.name;

jest.mock('../../../src/repositories/ClientAccountRepository');

const mockedClientAccountRepository = mocked(ClientAccountRepository, true);

const checkClientAccountNameMock = async (name: string) => {
    return name !== 'Existing Account';
};

const defaultContext = createContext();

beforeEach(() => {
    mockedClientAccountRepository.defaultInstance.checkNameAvailability.mockImplementation(
        checkClientAccountNameMock
    );
});

afterEach(() => {
    mockedClientAccountRepository.defaultInstance.checkNameAvailability.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} account name available`, async () => {
        const params = {
            name: 'Non Existing Account',
        };

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Name is available.',
            data: {
                isNameAvailable: true,
            },
        });

        const response = await checkClientAccountName(params, defaultContext);

        expect(response).toEqual(expectedResponse);

        expect(
            mockedClientAccountRepository.defaultInstance.checkNameAvailability
        ).toHaveBeenCalledTimes(1);
    });

    test(`${FUNCTION_NAME} account name not available`, async () => {
        const params = {
            name: 'Existing Account',
        };

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Name is not available.',
            data: {
                isNameAvailable: false,
            },
        });

        const response = await checkClientAccountName(params, defaultContext);

        expect(response).toEqual(expectedResponse);

        expect(
            mockedClientAccountRepository.defaultInstance.checkNameAvailability
        ).toHaveBeenCalledTimes(1);
    });
});

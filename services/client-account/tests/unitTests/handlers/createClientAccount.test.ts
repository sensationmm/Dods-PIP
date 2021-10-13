import {
    ClientAccountError,
    ClientAccountRepository,
} from '../../../src/repositories';
import {
    HttpResponse,
    HttpStatusCode,
    createContext,
} from '@dodsgroup/dods-lambda';

import { ClientAccountParameters } from '../../../src/domain';
import { createClientAccount } from '../../../src/handlers/createClientAccount/createClientAccount';
import { mocked } from 'ts-jest/utils';

const FUNCTION_NAME = createClientAccount.name;

const SUCCESS_ACCOUNT_RESPONSE = {
    uuid: 'ba52a39b-814a-41df-a0b8-60083f25ec9a',
    name: 'Juan account',
    notes: 'This is the account for Juan.',
    contact_name: 'Juan',
    contact_email_address: 'juan@xd.com',
    contact_telephone_number: '+573123456531',
};

jest.mock('../../../src/repositories/ClientAccountRepository');

const mockedClientAccountRepository = mocked(ClientAccountRepository, true);

const createClientAccountMock = async (params: ClientAccountParameters) => {
    if (!params.clientAccount.name) {
        throw new ClientAccountError('Error: Bad Request', {
            details: 'error test',
        });
    }

    if (params.clientAccount.name === 'Error Generator') {
        throw new Error('General error');
    }

    return SUCCESS_ACCOUNT_RESPONSE;
};

const checkClientAccountNameMock = async (name: string) => {
    return name !== 'Existing Account';
};

const defaultContext = createContext();

beforeEach(() => {
    mockedClientAccountRepository.defaultInstance.createClientAccount.mockImplementation(
        createClientAccountMock
    );
    mockedClientAccountRepository.defaultInstance.checkNameAvailability.mockImplementation(
        checkClientAccountNameMock
    );
});

afterEach(() => {
    mockedClientAccountRepository.defaultInstance.createClientAccount.mockClear();
    mockedClientAccountRepository.defaultInstance.checkNameAvailability.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid input`, async () => {
        const clientAccount = {
            name: 'Juan account',
            notes: 'This is the account for Juan.',
            contact_name: 'Juan',
            contact_email_address: 'juan@xd.com',
            contact_telephone_number: '+573123456531',
        };

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Client account successfully created.',
            data: SUCCESS_ACCOUNT_RESPONSE,
        });

        const response = await createClientAccount(
            { clientAccount },
            defaultContext
        );

        expect(response).toEqual(expectedResponse);

        expect(
            mockedClientAccountRepository.defaultInstance.createClientAccount
        ).toHaveBeenCalledTimes(1);
        expect(
            mockedClientAccountRepository.defaultInstance.checkNameAvailability
        ).toHaveBeenCalledTimes(1);
    });

    test(`${FUNCTION_NAME} account name not available`, async () => {
        const clientAccount = {
            name: 'Existing Account',
            notes: 'This is the account for Juan.',
            contact_name: 'Juan',
            contact_email_address: 'juan@xd.com',
            contact_telephone_number: '+573123456531',
        };

        const expectedResponse = new HttpResponse(HttpStatusCode.CONFLICT, {
            success: false,
            message: `A Client Account already exists with the name: ${clientAccount.name}`,
        });

        const response = await createClientAccount(
            { clientAccount },
            defaultContext
        );

        expect(response).toEqual(expectedResponse);

        expect(
            mockedClientAccountRepository.defaultInstance.createClientAccount
        ).toHaveBeenCalledTimes(0);
        expect(
            mockedClientAccountRepository.defaultInstance.checkNameAvailability
        ).toHaveBeenCalledTimes(1);
    });
});

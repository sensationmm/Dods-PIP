import { createContext, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { mocked } from 'ts-jest/utils';

import { ClientAccountParameters } from '../../../src/domain';
import { ClientAccountError, ClientAccountRepository, } from '../../../src/repositories';
import { createClientAccount } from '../../../src/handlers/createClientAccount/createClientAccount';

const FUNCTION_NAME = createClientAccount.name;

const SUCCESS_ACCOUNT_RESPONSE = {
    uuid: 'ba52a39b-814a-41df-a0b8-60083f25ec9a',
    name: 'Juan account',
    notes: 'This is the account for Juan.',
    contact_name: 'Juan',
    contact_email_address: 'juan@xd.com',
    contact_telephone_number: '+573123456531',
    contract_start_date: '2021-01-01T01:01:01.001Z',
    contract_rollover: false,
};

jest.mock('../../../src/repositories/ClientAccountRepository');

const mockedClientAccountRepository = mocked(ClientAccountRepository, true);

const createClientAccountMock = async (clientAccount: ClientAccountParameters) => {
    if (!clientAccount.name) {
        throw new ClientAccountError('Error: Bad Request', {
            details: 'error test',
        });
    }

    if (clientAccount.name === 'Error Generator') {
        throw new Error('General error');
    }

    return SUCCESS_ACCOUNT_RESPONSE;
};

const defaultContext = createContext();

beforeEach(() => {
    mockedClientAccountRepository.defaultInstance.createClientAccount.mockImplementation(createClientAccountMock);
});

afterEach(() => {
    mockedClientAccountRepository.defaultInstance.createClientAccount.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid input`, async () => {
        const clientAccount = {
            name: 'Juan account',
            notes: 'This is the account for Juan.',
            contact_name: 'Juan',
            contact_email_address: 'juan@xd.com',
            contact_telephone_number: '+573123456531',
            contract_start_date: '2021-01-01T01:01:01.001Z',
            contract_rollover: false,
        } as ClientAccountParameters;

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Client account successfully created.',
            data: SUCCESS_ACCOUNT_RESPONSE,
        });

        const response = await createClientAccount(clientAccount, defaultContext);

        expect(response).toEqual(expectedResponse);

        expect(mockedClientAccountRepository.defaultInstance.createClientAccount).toHaveBeenCalledTimes(1);
    });
});

import { createContext, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { mocked } from 'ts-jest/utils';

import { ClientAccountRepository } from '../../../src/repositories';
import { GetClientAccountParameters } from '../../../src/domain';
import { getClientAccount } from '../../../src/handlers/getClientAccount/getClientAccount';

const FUNCTION_NAME = getClientAccount.name;

const SUCCESS_ACCOUNT_RESPONSE = {
    uuid: '1dcad502-0c50-4dab-9192-13b5e882b95d',
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

const defaultContext = createContext();

afterEach(() => {
    mockedClientAccountRepository.defaultInstance.getClientAccount.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid input`, async () => {
        const parameters: GetClientAccountParameters = { clientAccountId: '1dcad502-0c50-4dab-9192-13b5e882b95d' };

        const expectedRepositoryResponse = SUCCESS_ACCOUNT_RESPONSE;

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, { message: 'Client account found.', data: expectedRepositoryResponse });

        mockedClientAccountRepository.defaultInstance.getClientAccount.mockResolvedValue(expectedRepositoryResponse);

        const response = await getClientAccount(parameters, defaultContext);

        expect(response).toEqual(expectedResponse);

        expect(mockedClientAccountRepository.defaultInstance.getClientAccount).toHaveBeenCalledWith(parameters.clientAccountId);

        expect(mockedClientAccountRepository.defaultInstance.getClientAccount).toHaveBeenCalledTimes(1);
    });
});

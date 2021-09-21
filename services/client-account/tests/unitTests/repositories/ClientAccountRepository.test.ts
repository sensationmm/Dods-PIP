import { ClientAccountRepository } from '../../../src/repositories';
import { mocked } from 'ts-jest/utils'

const MODULE_NAME = ClientAccountRepository.name;

const GET_CLIENT_ACCOUNT = ClientAccountRepository.defaultInstance.getClientAccount.name;

jest.mock("../../../src/repositories/ClientAccountRepository");

const mockedClientAccountMariaDb = mocked(ClientAccountRepository, true);

afterEach(() => {
    mockedClientAccountMariaDb.defaultInstance.getClientAccount.mockClear();
});

describe(`${MODULE_NAME} handler`, () => {

    test(`${GET_CLIENT_ACCOUNT} Valid input`, async () => {

        const clientAccountId = '71d0c73e-857f-4eab-b213-1d95f4f6118a';

        const expectedResponse = {
            id: 2,
            uuid: "71d0c73e-857f-4eab-b213-1d95f4f6118a",
            name: "Client Name",
            notes: "note here",
            contact_name: "contact name",
            contact_email_address: "contactemail@somoglobal.com",
            contact_telephone_number: "0755454545454",
            contract_start_date: "2021-08-22T00:00:00.000Z",
            contract_rollover: true
        };

        mockedClientAccountMariaDb.defaultInstance.getClientAccount.mockResolvedValue(expectedResponse);

        const response = await ClientAccountRepository.defaultInstance.getClientAccount(clientAccountId);

        expect(response).toEqual(expectedResponse);

        expect(mockedClientAccountMariaDb.defaultInstance.getClientAccount).toHaveBeenCalledWith(clientAccountId);

        expect(mockedClientAccountMariaDb.defaultInstance.getClientAccount).toHaveBeenCalledTimes(1);
    });

    test(`${GET_CLIENT_ACCOUNT} Invalid input`, async () => {

        const clientAccountId = '';
        try {
            mockedClientAccountMariaDb.defaultInstance.getClientAccount.mockImplementation(async (clientAccountId: string) => {
                if (!clientAccountId) {
                    throw new Error('Error: clientAccountId cannot be empty');
                }

                return [];
            });

            await ClientAccountRepository.defaultInstance.getClientAccount(clientAccountId);

            expect(true).toBe(false);
        } catch (error: any) {
            expect(error.message).toEqual('Error: clientAccountId cannot be empty');

            expect(mockedClientAccountMariaDb.defaultInstance.getClientAccount).toHaveBeenCalledWith(clientAccountId);

            expect(mockedClientAccountMariaDb.defaultInstance.getClientAccount).toHaveBeenCalledTimes(1);
        }
    });
});


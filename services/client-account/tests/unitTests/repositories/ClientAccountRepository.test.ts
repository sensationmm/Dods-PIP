import { ClientAccountRepository, ClientAccountMariaDb } from '../../../src/repositories';
import { mocked } from 'ts-jest/utils'

const MODULE_NAME = ClientAccountRepository.name;

const GET_CLIENT_ACCOUNT = ClientAccountRepository.defaultInstance.getClientAccount.name;

jest.mock("../../../src/repositories/ClientAccountMariaDb");

const mockedClientAccountMariaDb = mocked(ClientAccountMariaDb, true);

afterEach(() => {
    mockedClientAccountMariaDb.defaultInstance.getClientAccount.mockClear();
});

describe(`${MODULE_NAME} handler`, () => {

    test(`${GET_CLIENT_ACCOUNT} Valid input`, async () => {

        const clientAccountId = '111';

        const expectedResponse = [{ clientAccountId }];

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


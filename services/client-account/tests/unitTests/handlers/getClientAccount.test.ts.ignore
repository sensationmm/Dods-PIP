import { getClientAccount } from '../../../src/handlers/getClientAccount/getClientAccount';
import { ClientAccountRepository } from '../../../src/repositories';
import { mocked } from 'ts-jest/utils'
import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

const FUNCTION_NAME = getClientAccount.name;

jest.mock("../../../src/repositories/ClientAccountRepository");

const mockedClientAccountRepository = mocked(ClientAccountRepository, true);

afterEach(() => {
    mockedClientAccountRepository.defaultInstance.getClientAccount.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {

    test(`${FUNCTION_NAME} Valid input`, async () => {

        const clientAccountId = '71d0c73e-857f-4eab-b213-1d95f4f6118a';

        const expectedRepositoryResponse = [{ clientAccountId }];

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, `Hello world, parameters: ${JSON.stringify(expectedRepositoryResponse)}`)

        mockedClientAccountRepository.defaultInstance.getClientAccount.mockResolvedValue(expectedRepositoryResponse);

        const response = await getClientAccount({ clientAccountId });

        expect(response).toEqual(expectedResponse);

        expect(mockedClientAccountRepository.defaultInstance.getClientAccount).toHaveBeenCalledWith(clientAccountId);

        expect(mockedClientAccountRepository.defaultInstance.getClientAccount).toHaveBeenCalledTimes(1);
    });

    test(`${FUNCTION_NAME} Invalid input`, async () => {

        const clientAccountId = '';
        try {
            mockedClientAccountRepository.defaultInstance.getClientAccount.mockImplementation(async (clientAccountId: string) => {
                if (!clientAccountId) {
                    throw new Error('Error: clientAccountId cannot be empty');
                }

                return [];
            });

            await getClientAccount({ clientAccountId });

            expect(true).toBe(false);
        } catch (error: any) {
            expect(error.message).toEqual('Error: clientAccountId cannot be empty');

            expect(mockedClientAccountRepository.defaultInstance.getClientAccount).toHaveBeenCalledWith(clientAccountId);

            expect(mockedClientAccountRepository.defaultInstance.getClientAccount).toHaveBeenCalledTimes(1);
        }
    });
});

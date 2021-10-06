import { createContext, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { mocked } from 'ts-jest/utils';

import { ClientAccountRepository } from '../../../src/repositories';
import { getRemainingSeats } from '../../../src/handlers/getRemainingSeats/getRemainingSeats';
import { GetClientAccountParameters } from '../../../src/domain';

const FUNCTION_NAME = getRemainingSeats.name;

jest.mock('../../../src/repositories/ClientAccountRepository');

const mockedClientAccountRepository = mocked(ClientAccountRepository, true);

afterEach(() => {
    mockedClientAccountRepository.defaultInstance.getClientAccountSeats.mockClear();
    mockedClientAccountRepository.defaultInstance.getClientAccountUsers.mockClear();
});

const defaultContext = createContext();

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid input`, async () => {
        const clientAccountParameters: GetClientAccountParameters = { clientAccountId: '1234ABC' };

        const expectedClientUsersResponse = 3;

        const expectedSubscriptionSeats = 17;

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: `Remaining Seats 14`,
            data: 14,
        });

        mockedClientAccountRepository.defaultInstance.getClientAccountSeats.mockResolvedValue(expectedSubscriptionSeats);

        mockedClientAccountRepository.defaultInstance.getClientAccountUsers.mockResolvedValue(expectedClientUsersResponse);

        const response = await getRemainingSeats(clientAccountParameters, defaultContext);

        expect(response).toEqual(expectedResponse);
    });

    test(`${FUNCTION_NAME} Invalid input`, async () => {
        const clientAccountParameters: GetClientAccountParameters = { clientAccountId: '' };

        try {
            mockedClientAccountRepository.defaultInstance.getClientAccountSeats.mockImplementation(
                async (clientAccountId: string) => {
                    if (!clientAccountId) {
                        throw new Error(
                            'Error: clientAccountId cannot be empty'
                        );
                    }
                    return [];
                }
            );

            await getRemainingSeats(clientAccountParameters, defaultContext);

            expect(true).toBe(false);
        } catch (error: any) {
            expect(error.message).toEqual(
                'Error: clientAccountId cannot be empty'
            );
        }
    });

    test(`${FUNCTION_NAME} client account doesn't exist`, async () => {
        const clientAccountParameters: GetClientAccountParameters = { clientAccountId: '54ee9977-35a8-4cb8-baf3-d1d07920fd5f' };

        try {
            mockedClientAccountRepository.defaultInstance.getClientAccountSeats.mockImplementation(
                async (clientAccountId: string) => {
                    if (
                        clientAccountId !==
                        '54ee9977-35a8-4cb8-baf3-d1d07920fd5ds'
                    ) {
                        throw new Error(
                            'Error: clientAccountId cannot be empty'
                        );
                    }
                    return [];
                }
            );

            await getRemainingSeats(clientAccountParameters, defaultContext);

            expect(true).toBe(false);
        } catch (error: any) {
            expect(error.message).toEqual(
                'Error: clientAccountId cannot be empty'
            );
        }
    });
});

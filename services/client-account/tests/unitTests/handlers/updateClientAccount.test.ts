import {
    HttpResponse,
    HttpStatusCode,
    createContext,
} from '@dodsgroup/dods-lambda';

import { ClientAccountRepository } from '../../../src/repositories';
import { ClientAccountResponse } from '../../../src/domain';
import { mocked } from 'ts-jest/utils';
import { updateClientAccount } from '../../../src/handlers/updateClientAccount/updateClientAccount';

const FUNCTION_NAME = updateClientAccount.name;

const UPDATE_REPO_RESPONSE: ClientAccountResponse = {
    uuid: '22dd3ef9-6871-4773-8298-f190cc8d5c85',
    name: 'OtherNames',
    contactName: 'MikeFly',
    contactEmailAddress: 'mike@example.com',
    contactTelephoneNumber: '313222123',
    contractStartDate: new Date('2021-01-01T01:01:01.001Z'),
    contractRollover: false,
    contractEndDate: new Date('2022-02-01T01:01:01.001Z'),
    subscriptionSeats: 20,
    consultantHours: 13,
    subscription: {
        uuid: '4de05e7d-3394-4890-8347-a4db53b3691f',
        name: 'subs_1',
        location: 2,
        contentType: 2,
    },
};

const SUCCESS_UPDATE_ACCOUNT = {
    uuid: '22dd3ef9-6871-4773-8298-f190cc8d5c85',
    name: 'OtherNames',
    contactName: 'MikeFly',
    contactEmailAddress: 'mike@example.com',
    contactTelephoneNumber: '313222123',
    contractStartDate: new Date('2021-01-01T01:01:01.001Z'),
    contractRollover: false,
    contractEndDate: new Date('2022-02-01T01:01:01.001Z'),
    subscriptionSeats: 20,
    consultantHours: 13,
    subscription: {
        uuid: '4de05e7d-3394-4890-8347-a4db53b3691f',
        name: 'subs_1',
        location: 2,
        contentType: 2,
    },
};

jest.mock('../../../src/repositories/ClientAccountRepository');

const mockedClientAccountRepository = mocked(ClientAccountRepository, true);

const defaultContext = createContext();

afterEach(() => {
    mockedClientAccountRepository.defaultInstance.updateClientAccount.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid input Happy case `, async () => {
        const clientAccount = {
            clientAccountId: '1dcad502-0c50-4dab-9192-13b5e882b95d',
            subscription: 'efe4bd45-3ccf-4ef7-8c09-f38e1d954a45',
            subscriptionSeats: 20,
            consultantHours: 13,
            contractStartDate: '2021-01-01T01:01:01.001Z',
            contractRollover: true,
            contractEndDate: '2022-02-01T01:01:01.001Z',
            isUK: true,
            isEU: false,
        };

        const expectedRepositoryResponse = UPDATE_REPO_RESPONSE;

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Client account successfully updated.',
            data: SUCCESS_UPDATE_ACCOUNT,
        });

        mockedClientAccountRepository.defaultInstance.updateClientAccount.mockResolvedValue(
            expectedRepositoryResponse
        );

        const response = await updateClientAccount(
            clientAccount,
            defaultContext
        );

        expect(response).toEqual(expectedResponse);

        expect(
            mockedClientAccountRepository.defaultInstance.updateClientAccount
        ).toHaveBeenCalledTimes(1);
    });

    test(`${FUNCTION_NAME} Wrong dates`, async () => {
        const clientAccount = {
            clientAccountId: '1dcad502-0c50-4dab-9192-13b5e882b95d',
            subscription: 'efe4bd45-3ccf-4ef7-8c09-f38e1d954a45',
            subscriptionSeats: 20,
            consultantHours: 13,
            contractStartDate: '2021-01-01T01:01:01.001Z',
            contractRollover: false,
            contractEndDate: '2020-02-01T01:01:01.001Z',
            isUK: true,
            isEU: false,
        };

        const expectedResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'End date must be greater than start date',
        });

        const response = await updateClientAccount(
            clientAccount,
            defaultContext
        );

        expect(response).toEqual(expectedResponse);
    });

    test(`${FUNCTION_NAME} empty date `, async () => {
        const clientAccount = {
            clientAccountId: '1dcad502-0c50-4dab-9192-13b5e882b95d',
            subscription: 'efe4bd45-3ccf-4ef7-8c09-f38e1d954a45',
            subscriptionSeats: 20,
            consultantHours: 13,
            contractStartDate: '2021-01-01T01:01:01.001Z',
            contractRollover: false,
            contractEndDate: '',
            isUK: true,
            isEU: false,
        };

        const expectedResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Must provide contract end Date',
        });

        const response = await updateClientAccount(
            clientAccount,
            defaultContext
        );

        expect(response).toEqual(expectedResponse);
    });

    test(`${FUNCTION_NAME} Client Account empty`, async () => {
        const clientAccount = {
            clientAccountId: '',
            subscription: 'efe4bd45-3ccf-4ef7-8c09-f38e1d954a45',
            subscriptionSeats: 20,
            consultantHours: 13,
            contractStartDate: '2021-01-01T01:01:01.001Z',
            contractRollover: false,
            contractEndDate: '2022-02-01T01:01:01.001Z',
            isUK: true,
            isEU: false,
        };
        try {
            mockedClientAccountRepository.defaultInstance.updateClientAccount.mockImplementation(
                async (clientAccount) => {
                    if (!clientAccount.clientAccountId) {
                        throw new Error(
                            'Error: clientAccountId cannot be empty'
                        );
                    }

                    return [];
                }
            );

            await updateClientAccount(clientAccount, defaultContext);

            expect(true).toBe(false);
        } catch (error: any) {
            expect(error.message).toEqual(
                'Error: clientAccountId cannot be empty'
            );
        }
    });

    test(`${FUNCTION_NAME} Client Account Doesn't exist`, async () => {
        const clientAccount = {
            clientAccountId: '1dcad502-0c50-4dab-9192-13b5e882b95d',
            subscription: 'efe4bd45-3ccf-4ef7-8c09-f38e1d954a45',
            subscriptionSeats: 20,
            consultantHours: 13,
            contractStartDate: '2021-01-01T01:01:01.001Z',
            contractRollover: false,
            contractEndDate: '2022-02-01T01:01:01.001Z',
            isUK: true,
            isEU: false,
        };
        try {
            mockedClientAccountRepository.defaultInstance.updateClientAccount.mockImplementation(
                async (clientAccount) => {
                    if (
                        clientAccount.clientAccountId !==
                        '1dcad502-0c50-4dab-9192-13b5e882b95f'
                    ) {
                        throw new Error('Error: clientAccount not found');
                    }

                    return [];
                }
            );

            await updateClientAccount(clientAccount, defaultContext);

            expect(true).toBe(false);
        } catch (error: any) {
            expect(error.message).toEqual('Error: clientAccount not found');
        }
    });

    test(`${FUNCTION_NAME} Suscription id doesn't exist `, async () => {
        const clientAccount = {
            clientAccountId: '1dcad502-0c50-4dab-9192-13b5e882b95d',
            subscription: 'efe4bd45-3ccf-4ef7-8c09-f38e1d954a45',
            subscriptionSeats: 20,
            consultantHours: 13,
            contractStartDate: '2021-01-01T01:01:01.001Z',
            contractRollover: false,
            contractEndDate: '2022-02-01T01:01:01.001Z',
            isUK: true,
            isEU: false,
        };

        try {
            mockedClientAccountRepository.defaultInstance.updateClientAccount.mockImplementation(
                async (clientAccount) => {
                    if (
                        clientAccount.subscription !==
                        'efe4bd45-3ccf-4ef7-8c09-f38e1d954a42'
                    ) {
                        throw new Error('Error: Wrong subscription uuid');
                    }

                    return [];
                }
            );

            await updateClientAccount(clientAccount, defaultContext);

            expect(true).toBe(false);
        } catch (error: any) {
            expect(error.message).toEqual('Error: Wrong subscription uuid');
        }
    });
});

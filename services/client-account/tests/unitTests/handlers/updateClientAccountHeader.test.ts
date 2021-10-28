import {
    HttpResponse,
    HttpStatusCode,
    createContext,
} from '@dodsgroup/dods-lambda';

import { ClientAccountRepository } from '../../../src/repositories';
import { ClientAccountResponse } from '../../../src/domain';
import { mocked } from 'ts-jest/utils';
import { updateClientAccountHeader } from '../../../src/handlers/updateClientAccountHeader/updateClientAccountHeader';

const FUNCTION_NAME = updateClientAccountHeader.name;

const UPDATE_REPO_RESPONSE: ClientAccountResponse = {
    uuid: '22dd3ef9-6871-4773-8298-f190cc8d5c85',
    name: 'OtherNames',
    contactName: 'Mike Fly',
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
    contactName: 'Mike Fly',
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
    mockedClientAccountRepository.defaultInstance.updateClientAccountHeader.mockClear();
    mockedClientAccountRepository.defaultInstance.checkNameAvailability.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid input Happy case `, async () => {
        const clientAccount = {
            clientAccountId: '1dcad502-0c50-4dab-9192-13b5e882b95d',
            name: 'Company_4',
            notes: 'this is the compnay 1 ',
            contactName: 'George Beckamn',
            contactEmailAddress: 'george@gmail.com',
            contactTelephoneNumber: '+576933792',
        };

        mockedClientAccountRepository.defaultInstance.checkNameAvailability.mockImplementation(
            async () => {
                return true;
            }
        );

        const expectedRepositoryResponse = UPDATE_REPO_RESPONSE;

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Client account successfully updated.',
            data: SUCCESS_UPDATE_ACCOUNT,
        });

        mockedClientAccountRepository.defaultInstance.updateClientAccountHeader.mockResolvedValue(
            expectedRepositoryResponse
        );

        const response = await updateClientAccountHeader(
            clientAccount,
            defaultContext
        );

        expect(response).toEqual(expectedResponse);
    });

    test(`${FUNCTION_NAME} account name not available`, async () => {
        const clientAccount = {
            clientAccountId: '1dcad502-0c50-4dab-9192-13b5e882b95d',
            name: 'Company_4',
            notes: 'this is the compnay 1 ',
            contactName: 'George Beckamn',
            contactEmailAddress: 'george@gmail.com',
            contactTelephoneNumber: '+576933792',
        };

        mockedClientAccountRepository.defaultInstance.checkNameAvailability.mockImplementation(
            async () => {
                return false;
            }
        );

        const expectedResponse = new HttpResponse(HttpStatusCode.CONFLICT, {
            success: false,
            message: 'Client account name already exists',
        });

        const response = await updateClientAccountHeader(
            clientAccount,
            defaultContext
        );

        expect(response).toEqual(expectedResponse);
    });
});

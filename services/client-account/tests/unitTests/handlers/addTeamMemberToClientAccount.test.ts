import { createContext, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { mocked } from 'ts-jest/utils';

import { ClientAccountTeamParameters, ClientAccountResponse } from '../../../src/domain';
import { ClientAccountRepository, ClientAccountTeamRepository } from '../../../src/repositories';
import { addTeamMemberToClientAccount } from '../../../src/handlers/addTeamMemberToClientAccount/addTeamMemberToClientAccount';

const FUNCTION_NAME = addTeamMemberToClientAccount.name;

jest.mock('../../../src/repositories/ClientAccountRepository');
jest.mock('../../../src/repositories/ClientAccountTeamRepository');

const mockedClientAccountRepository = mocked(ClientAccountRepository, true);
const mockedClientAccountTeamRepository = mocked(ClientAccountTeamRepository, true);

const defaultContext = createContext();

afterEach(() => {
    mockedClientAccountRepository.defaultInstance.findOne.mockClear();
    mockedClientAccountTeamRepository.defaultInstance.create.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid input`, async () => {
        const clientAccountTeamParameters = { clientAccountTeam: { userId: 1, teamMemberType: 1, clientAccountId: 1 } } as ClientAccountTeamParameters;

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            sucess: true,
            message: 'Team member was added to the client account.',
            data: clientAccountTeamParameters.clientAccountTeam,
        });

        mockedClientAccountRepository.defaultInstance.findOne.mockImplementation(async () => {
            return { subscription_seats: 2 } as ClientAccountResponse
        });

        const response = await addTeamMemberToClientAccount(clientAccountTeamParameters, defaultContext);

        expect(response).toEqual(expectedResponse);

        expect(mockedClientAccountRepository.defaultInstance.findOne).toHaveBeenCalledTimes(1);

        expect(mockedClientAccountTeamRepository.defaultInstance.create).toHaveBeenCalledTimes(1);
    });

    test(`${FUNCTION_NAME} Invalid input`, async () => {
        const clientAccountTeamParameters = { clientAccountTeam: { userId: 1, teamMemberType: 1, clientAccountId: 1 } } as ClientAccountTeamParameters;

        mockedClientAccountRepository.defaultInstance.findOne.mockImplementation(async () => {
            return { subscription_seats: 0 } as ClientAccountResponse
        });

        try {
            await addTeamMemberToClientAccount(clientAccountTeamParameters, defaultContext);

            expect(true).toEqual(false);
        } catch (error: any) {
            expect(error.message).toEqual('Client Account has not enough available seats');

            expect(mockedClientAccountRepository.defaultInstance.findOne).toHaveBeenCalledTimes(1);
        }
    });
});

import {
    ClientAccountRepository,
    ClientAccountTeamRepository,
} from '../../../src/repositories';
import {
    ClientAccountResponse,
    ClientAccountTeamParameters,
} from '../../../src/domain';
import {
    HttpResponse,
    HttpStatusCode,
    createContext,
} from '@dodsgroup/dods-lambda';

import { addTeamMemberToClientAccount } from '../../../src/handlers/addTeamMemberToClientAccount/addTeamMemberToClientAccount';
import { mocked } from 'ts-jest/utils';

const FUNCTION_NAME = addTeamMemberToClientAccount.name;

jest.mock('../../../src/repositories/ClientAccountRepository');
jest.mock('../../../src/repositories/ClientAccountTeamRepository');

const mockedClientAccountRepository = mocked(ClientAccountRepository, true);
const mockedClientAccountTeamRepository = mocked(
    ClientAccountTeamRepository,
    true
);

const defaultContext = createContext();

afterEach(() => {
    mockedClientAccountRepository.defaultInstance.findOne.mockClear();
    mockedClientAccountTeamRepository.defaultInstance.create.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid input`, async () => {
        const clientAccountTeamParameters = {
            clientAccountTeam: {
                userId: 1,
                teamMemberType: 1,
                clientAccountId: 1,
            },
        } as ClientAccountTeamParameters;

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            sucess: true,
            message: 'Team member was added to the client account.',
            data: clientAccountTeamParameters.clientAccountTeam,
        });

        mockedClientAccountRepository.defaultInstance.findOne.mockImplementation(
            async () => {
                return { subscriptionSeats: 2 } as ClientAccountResponse;
            }
        );

        const response = await addTeamMemberToClientAccount(
            clientAccountTeamParameters,
            defaultContext
        );

        expect(response).toEqual(expectedResponse);

        expect(
            mockedClientAccountTeamRepository.defaultInstance.create
        ).toHaveBeenCalledTimes(1);
    });

    test(`${FUNCTION_NAME} Invalid input`, async () => {
        const clientAccountTeamParameters = {
            clientAccountTeam: {
                userId: 1,
                teamMemberType: 1,
                clientAccountId: 1,
            },
        } as ClientAccountTeamParameters;

        mockedClientAccountRepository.defaultInstance.findOne.mockImplementation(
            async () => {
                return { subscriptionSeats: 0 } as ClientAccountResponse;
            }
        );

        mockedClientAccountRepository.defaultInstance.getClientAccountUsers.mockImplementation(
            async () => {
                return 0;
            }
        );

        try {
            await addTeamMemberToClientAccount(
                clientAccountTeamParameters,
                defaultContext
            );

            expect(true).toEqual(false);
        } catch (error: any) {
            expect(error.message).toEqual(
                'Client Account has not enough available seats'
            );

            expect(
                mockedClientAccountRepository.defaultInstance.findOne
            ).toHaveBeenCalledTimes(1);
        }
    });
});

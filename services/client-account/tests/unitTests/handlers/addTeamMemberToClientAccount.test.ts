import { ClientAccountModel, UserProfileModelAttributes } from '../../../src/db';
import { ClientAccountRepository, ClientAccountTeamRepository, UserProfileRepository, } from '../../../src/repositories';
import { HttpResponse, HttpStatusCode, createContext, } from '@dodsgroup/dods-lambda';

import { ClientAccountTeamParameters } from '../../../src/domain';
import { addTeamMemberToClientAccount } from '../../../src/handlers/addTeamMemberToClientAccount/addTeamMemberToClientAccount';
import { mocked } from 'ts-jest/utils';

const FUNCTION_NAME = addTeamMemberToClientAccount.name;

jest.mock('../../../src/repositories/ClientAccountRepository');
jest.mock('../../../src/repositories/ClientAccountTeamRepository');
jest.mock('../../../src/repositories/UserProfileRepository');

const mockedClientAccountRepository = mocked(ClientAccountRepository, true);
const mockedClientAccountTeamRepository = mocked(ClientAccountTeamRepository, true);
const mockedUserProfileRepository = mocked(UserProfileRepository, true);

const defaultContext = createContext();

const defaultClientAccountTeamParameters: ClientAccountTeamParameters = {
    clientAccountId: 'e004005e-d375-4be6-972e-9d1bd87c42db',
    teamMembers: [
        {
            userId: 'd725a90e-2908-4e2e-9f6c-319498b80999',
            teamMemberType: 1,
        },
        {
            userId: '2affb9c7-a32f-4f5b-97c6-a2cc9a9625ca',
            teamMemberType: 2,
        },
    ],
};

const defaultClientAccount = {
    uuid: 'ba52a39b-814a-41df-a0b8-60083f25eeee',
    subscriptionSeats: 2,
} as ClientAccountModel;

const defaultUserProfile = {
    id: 1,
    uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3',
    firstName: 'kenan',
    lastName: 'hancer',
    title: 'Mr',
    roleId: 1,
    primaryEmail: 'k@h.com',
} as UserProfileModelAttributes;

afterEach(() => {
    mockedClientAccountRepository.defaultInstance.findOne.mockClear();
    mockedClientAccountTeamRepository.defaultInstance.create.mockClear();
    mockedUserProfileRepository.defaultInstance.findOne.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid input`, async () => {
        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            sucess: true,
            message: 'Team members were added to the client account.',
        });

        mockedClientAccountRepository.defaultInstance.findOne.mockResolvedValue(
            defaultClientAccount
        );

        mockedUserProfileRepository.defaultInstance.findOne.mockResolvedValue(
            defaultUserProfile
        );

        const response = await addTeamMemberToClientAccount(
            defaultClientAccountTeamParameters,
            defaultContext
        );

        expect(response).toEqual(expectedResponse);
    });

    test(`${FUNCTION_NAME} Invalid input`, async () => {
        mockedClientAccountRepository.defaultInstance.findOne.mockResolvedValue(
            {
                uuid: 'ba52a39b-814a-41df-a0b8-60083f25eeee',
                // subscriptionSeats: 0,
            } as ClientAccountModel
        );

        mockedUserProfileRepository.defaultInstance.findOne.mockResolvedValue(
            defaultUserProfile
        );

        mockedClientAccountRepository.defaultInstance.getClientAccountUsers.mockResolvedValue(
            0
        );

        try {
            await addTeamMemberToClientAccount(
                defaultClientAccountTeamParameters,
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

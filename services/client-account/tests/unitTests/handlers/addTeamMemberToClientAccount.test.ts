import {
    ClientAccountRepository,
    ClientAccountTeamRepository,
    UserProfileRepository,
} from '../../../src/repositories';
import {
    ClientAccountTeamParameters,
} from '../../../src/domain';
import {
    HttpResponse,
    HttpStatusCode,
    createContext,
} from '@dodsgroup/dods-lambda';

import { addTeamMemberToClientAccount } from '../../../src/handlers/addTeamMemberToClientAccount/addTeamMemberToClientAccount';
import { mocked } from 'ts-jest/utils';
import { ClientAccountModel, UserProfileModel } from '../../../src/db';

const FUNCTION_NAME = addTeamMemberToClientAccount.name;

jest.mock('../../../src/repositories/ClientAccountRepository');
jest.mock('../../../src/repositories/ClientAccountTeamRepository');
jest.mock('../../../src/repositories/UserProfileRepository');

const mockedClientAccountRepository = mocked(ClientAccountRepository, true);
const mockedClientAccountTeamRepository = mocked(ClientAccountTeamRepository, true);
const mockedUserProfileRepository = mocked(UserProfileRepository, true);

const defaultContext = createContext();
const defaultClientAccountTeamParameters: ClientAccountTeamParameters = {
    clientAccountTeam: {
        userUuid: 'bb52a39b-814a-41df-a0b8-60083f25ec9a',
        teamMemberType: 1,
        clientAccountUuid: 'cc52a39b-814a-41df-a0b8-60083f25ec9a',
    },
};
const defaultClientAccount = { uuid: 'ba52a39b-814a-41df-a0b8-60083f25eeee', subscriptionSeats: 2 } as ClientAccountModel;

const defaultUserProfile = {
    id: 1,
    uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3',
    firstName: 'kenan',
    lastName: 'hancer',
    title: 'Mr',
    roleId: 1,
    primaryEmail: 'k@h.com',
} as UserProfileModel;

afterEach(() => {
    mockedClientAccountRepository.defaultInstance.findOne.mockClear();
    mockedClientAccountTeamRepository.defaultInstance.create.mockClear();
    mockedUserProfileRepository.defaultInstance.findOne.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid input`, async () => {

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            sucess: true,
            message: 'Team member was added to the client account.',
            data: defaultClientAccountTeamParameters.clientAccountTeam,
        });

        mockedClientAccountRepository.defaultInstance.findOne.mockResolvedValue(defaultClientAccount);

        mockedUserProfileRepository.defaultInstance.findOne.mockResolvedValue(defaultUserProfile);

        const response = await addTeamMemberToClientAccount(
            defaultClientAccountTeamParameters,
            defaultContext
        );

        expect(response).toEqual(expectedResponse);

        expect(
            mockedClientAccountTeamRepository.defaultInstance.create
        ).toHaveBeenCalledTimes(1);
    });

    test(`${FUNCTION_NAME} Invalid input`, async () => {

        mockedClientAccountRepository.defaultInstance.findOne.mockResolvedValue({ uuid: 'ba52a39b-814a-41df-a0b8-60083f25eeee', subscriptionSeats: 0 } as ClientAccountModel);

        mockedUserProfileRepository.defaultInstance.findOne.mockResolvedValue(defaultUserProfile);

        mockedClientAccountRepository.defaultInstance.getClientAccountUsers.mockResolvedValue(0);

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

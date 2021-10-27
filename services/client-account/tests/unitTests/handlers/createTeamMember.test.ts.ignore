import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';
import { NewTeamMemberParameters, TeamMemberResponse } from '../../../src/domain';

import { ClientAccountRepository } from '../../../src/repositories';
import { UserProfileRepository } from '../../../../user-profile/src/repositories/UserProfileRepository';
import { createTeamMember } from '../../../src/handlers/createTeamMember/createTeamMember';
import { mocked } from 'ts-jest/utils';

const FUNCTION_NAME = createTeamMember.name;

const SUCCESS_ACCOUNT_RESPONSE: TeamMemberResponse[] = [
    {
        id: '89139c46-711d-42cf-affd-b865dd9191eb',
        name: 'New Tester',
        type: 'client',
    },
    {
        id: '30360fcd-91be-46f3-8177-e2123f756838',
        name: 'Employee Example',
        type: 'client',
    },
];

jest.mock('../../../src/repositories/ClientAccountRepository');
jest.mock('../../../../user-profile/src/repositories/UserProfileRepository');

const mockedClientAccountRepository = mocked(ClientAccountRepository, true);
const mockedUserProfileRepository = mocked(UserProfileRepository, true);

const defaultContext = createContext();

afterEach(() => {
    mockedClientAccountRepository.defaultInstance.addTeamMember.mockClear();
    mockedClientAccountRepository.defaultInstance.getClientAccountAvailableSeats.mockClear();
    mockedUserProfileRepository.defaultInstance.createUserProfile.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid input`, async () => {
        const parameters: NewTeamMemberParameters = {
            clientAccountId: '1dcad502-0c50-4dab-9192-13b5e882b95d',
            userProfile: {
                title: 'Sir.',
                first_name: 'New',
                last_name: 'Tester',
                primary_email_address: 'dodstestlocal1@mailinator.com',
                secondary_email_address: 'dodstestlocal2@mailinator.com',
                telephone_number_1: '+573214858576',
                telephone_number_2: '+573214858577',
                role_id: '24e7ca86-1788-4b6e-b153-9c963dc928cb',
            },
            teamMemberType: 2,
        };

        const expectedRepositoryResponse = SUCCESS_ACCOUNT_RESPONSE;

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Team member was created and added to the client account.',
            data: expectedRepositoryResponse,
        });

        mockedClientAccountRepository.defaultInstance.getClientAccountAvailableSeats.mockResolvedValue(
            2
        );
        mockedUserProfileRepository.defaultInstance.createUserProfile.mockResolvedValue({
            id: '89139c46-711d-42cf-affd-b865dd9191eb',
            title: 'Sir.',
            first_name: 'New',
            last_name: 'Tester',
            primary_email_address: 'dodstestlocal1@mailinator.com',
            secondary_email_address: 'dodstestlocal2@mailinator.com',
            telephone_number_1: '+573214858576',
            telephone_number_2: '+573214858577',
            role: {
                id: '24e7ca86-1788-4b6e-b153-9c963dc928cb',
                title: 'User',
                dods_role: false,
            },
        });
        mockedClientAccountRepository.defaultInstance.addTeamMember.mockResolvedValue(
            SUCCESS_ACCOUNT_RESPONSE
        );

        const response = await createTeamMember(parameters, defaultContext);

        expect(response).toEqual(expectedResponse);
    });
});

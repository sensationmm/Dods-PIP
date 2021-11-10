import {
    GetClientAccountParameters,
    TeamMemberResponse,
} from '../../../src/domain';
import {
    HttpResponse,
    HttpStatusCode,
    createContext,
} from '@dodsgroup/dods-lambda';

import { ClientAccountRepository } from '../../../src/repositories';
import { getClientAccountTeamMembers } from '../../../src/handlers/getClientAccountTeamMembers/getClientAccountTeamMembers';
import { mocked } from 'ts-jest/utils';

const FUNCTION_NAME = getClientAccountTeamMembers.name;

const SUCCESS_ACCOUNT_RESPONSE: TeamMemberResponse[] = [
    {
        id: '89139c46-711d-42cf-affd-b865dd9191eb',
        name: 'Latest Tester',
        teamMemberType: 1,
    },
    {
        id: '30360fcd-91be-46f3-8177-e2123f756838',
        name: 'Employee Example',
        teamMemberType: 2,
    },
];

jest.mock('../../../src/repositories/ClientAccountRepository');

const mockedClientAccountRepository = mocked(ClientAccountRepository, true);

const defaultContext = createContext();

afterEach(() => {
    mockedClientAccountRepository.defaultInstance.getClientAccountTeam.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid input`, async () => {
        const parameters: GetClientAccountParameters = {
            clientAccountId: '1dcad502-0c50-4dab-9192-13b5e882b95d',
        };

        const expectedRepositoryResponse = SUCCESS_ACCOUNT_RESPONSE;

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            message: 'Client account found.',
            data: expectedRepositoryResponse,
        });

        mockedClientAccountRepository.defaultInstance.getClientAccountTeam.mockResolvedValue(
            expectedRepositoryResponse
        );

        const response = await getClientAccountTeamMembers(
            parameters,
            defaultContext
        );

        expect(response).toEqual(expectedResponse);

        expect(
            mockedClientAccountRepository.defaultInstance.getClientAccountTeam
        ).toHaveBeenCalledWith(parameters.clientAccountId);

        expect(
            mockedClientAccountRepository.defaultInstance.getClientAccountTeam
        ).toHaveBeenCalledTimes(1);
    });
});

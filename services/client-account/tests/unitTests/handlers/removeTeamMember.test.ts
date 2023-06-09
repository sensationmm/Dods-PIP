import { ClientAccountOutput, ClientAccountTeamOutput } from '@dodsgroup/dods-model';
import { ClientAccountRepositoryV2, ClientAccountTeamRepositoryV2, IamRepository, UserProfileRepository, } from '../../../src/repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { RemoveTeamMemberParameters } from '../../../src/domain';
import { UserProfileModelAttributes } from '../../../src/db';
import { UserProfileRepositoryV2 } from '../../../src/repositories/UserProfileRepositoryV2';
import { mocked } from 'ts-jest/utils';
import { removeTeamMember } from '../../../src/handlers/removeTeamMember/removeTeamMember';

jest.mock('../../../src/repositories/ClientAccountRepositoryV2');
jest.mock('../../../src/repositories/ClientAccountTeamRepositoryV2');
jest.mock('../../../src/repositories/UserProfileRepository');
jest.mock('../../../src/repositories/IamRepository');
jest.mock('../../../src/repositories/UserProfileRepositoryV2');

const mockedClientAccountRepositoryV2 = mocked(ClientAccountRepositoryV2, true);
const mockedUserProfileRepository = mocked(UserProfileRepository, true);
const mockedClientAccountTeamRepository = mocked(ClientAccountTeamRepositoryV2, true);
const mockedIamRepository = mocked(IamRepository, true);
const mockedUserProfileRepositoryV2 = mocked(UserProfileRepositoryV2, true);

const defaultContext = createContext();

const FUNCTION_NAME = removeTeamMember.name;

afterEach(() => {
    mockedClientAccountRepositoryV2.defaultInstance.findOne.mockClear();

    mockedUserProfileRepository.defaultInstance.findOne.mockClear();

    mockedClientAccountTeamRepository.defaultInstance.findOne.mockClear();

    mockedIamRepository.defaultInstance.destroyUser.mockClear();

});

describe(`${FUNCTION_NAME}`, () => {
    test(`${FUNCTION_NAME} Valid input`, async () => {
        const defaultRemoveTeamMemberParameters: RemoveTeamMemberParameters = { clientAccountId: '1dcad502-0c50-4dab-9192-13b5e882b97d', userId: '1dcad502-0c50-4dab-9192-13b5e882b95d' };

        const defaultFindOneInClientAccountRepositoryResponse = { id: 1 } as ClientAccountOutput;

        const defaultFindOneInUserProfileResponse = { id: 1 } as UserProfileModelAttributes;

        const defaultFindOneInClientAccountTeamResponse = { userId: 1, clientAccountId: 1, teamMemberType: 3 } as ClientAccountTeamOutput;


        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Team member successfully removed.',
        });

        mockedClientAccountRepositoryV2.defaultInstance.findOne.mockResolvedValue(defaultFindOneInClientAccountRepositoryResponse)

        mockedUserProfileRepository.defaultInstance.findOne.mockResolvedValue(defaultFindOneInUserProfileResponse);

        mockedClientAccountTeamRepository.defaultInstance.findOne.mockResolvedValue(defaultFindOneInClientAccountTeamResponse);

        mockedUserProfileRepositoryV2.defaultInstance.deleteUser.mockImplementation(() => Promise.resolve(true));

        const response = await removeTeamMember(defaultRemoveTeamMemberParameters, defaultContext);

        expect(response).toEqual(expectedResponse);

        expect(mockedClientAccountRepositoryV2.defaultInstance.findOne).toHaveBeenCalledTimes(1);
        expect(mockedUserProfileRepository.defaultInstance.findOne).toHaveBeenCalledTimes(1);
        expect(mockedIamRepository.defaultInstance.destroyUser).toHaveBeenCalledTimes(1);
        expect(mockedUserProfileRepositoryV2.defaultInstance.deleteUser).toHaveBeenCalledTimes(1);
    });


});
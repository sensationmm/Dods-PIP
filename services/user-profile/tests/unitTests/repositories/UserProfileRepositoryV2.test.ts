import { User, Role } from '@dodsgroup/dods-model';
import { mocked } from 'ts-jest/utils';
import { SearchUsersInput } from '../../../src/domain';

import { UserProfileRepositoryV2 } from '../../../src/repositories/UserProfileRepositoryV2';


const defaultRoleSequelizeResult = { id: 1 } as Role;

const defaultSearchUsersSequelizeResult = {
    rows: [
        { uuid: '24e7ca86-1788-4b6e-b153-9c963dc921we', firstName: 'Test First Name1', lastName: 'Test Last Name1', primaryEmail: '', role: { title: '' } } as any,
        { uuid: '24e7ca86-1788-4b6e-b153-9c963dc922ew', firstName: 'Test First Name2', lastName: 'Test Last Name2', primaryEmail: '', role: { title: '' } } as any,
    ],
    count: 2
};

const defaultSearchUsersRepositoryResult = {
    users: defaultSearchUsersSequelizeResult.rows.map(({ uuid, firstName, lastName, primaryEmail, role }) => ({ uuid, firstName, lastName, email: primaryEmail, role: role.title })),
    count: defaultSearchUsersSequelizeResult.count
};

jest.mock('@dodsgroup/dods-model');

const mockedUser = mocked(User);
const mockedRole = mocked(Role);

mockedUser.findAndCountAll.mockResolvedValue(defaultSearchUsersSequelizeResult);

const CLASS_NAME = UserProfileRepositoryV2.name;
const SEARCH_USERS_FUNCTION_NAME = UserProfileRepositoryV2.defaultInstance.searchUsers.name;

afterAll(() => {
    mockedRole.mockClear();
});

describe(`${CLASS_NAME}`, () => {
    test(`${SEARCH_USERS_FUNCTION_NAME} Valid input Happy case`, async () => {

        const searchUsersParameters: SearchUsersInput = {};

        const response = await UserProfileRepositoryV2.defaultInstance.searchUsers(searchUsersParameters);

        expect(response).toEqual(defaultSearchUsersRepositoryResult);
    });

    test(`${SEARCH_USERS_FUNCTION_NAME} Valid input with more fields`, async () => {

        mockedRole.findOne.mockResolvedValue(defaultRoleSequelizeResult);

        const searchUsersParameters: SearchUsersInput = {
            name: 'test name',
            startsWith: 'te',
            role: 'testRole',
            limit: 10,
            offset: 0,
            sortBy: 'lastName',
            sortDirection: 'ASC'
        };

        const response = await UserProfileRepositoryV2.defaultInstance.searchUsers(searchUsersParameters);

        expect(response).toEqual(defaultSearchUsersRepositoryResult);
    });

    test(`${SEARCH_USERS_FUNCTION_NAME} Invalid input for role field`, async () => {

        mockedRole.findOne.mockResolvedValue(undefined as any);

        const searchUsersParameters: SearchUsersInput = {
            name: 'test name',
            startsWith: 'te',
            role: 'testRole',
            limit: 10,
            offset: 0,
            sortBy: 'lastName',
            sortDirection: 'ASC'
        };

        try {
            await UserProfileRepositoryV2.defaultInstance.searchUsers(searchUsersParameters);

            throw new Error('Code never should come in this point');
        } catch (error: any) {
            expect(error.message).toEqual(`Error: RoleUuid ${searchUsersParameters.role} does not exist`);
        }
    });
});
import { User, Role } from '@dodsgroup/dods-model';
import { mocked } from 'ts-jest/utils';
import { CreateUserPersisterInput, SearchUsersInput } from '../../../src/domain';

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
const CREATE_USER_FUNCTION_NAME = UserProfileRepositoryV2.defaultInstance.createUser.name;

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
            sortBy: 'role',
            sortDirection: 'ASC'
        };

        const response1 = await UserProfileRepositoryV2.defaultInstance.searchUsers(searchUsersParameters);

        expect(response1).toEqual(defaultSearchUsersRepositoryResult);

        searchUsersParameters.sortBy = 'account';

        const response2 = await UserProfileRepositoryV2.defaultInstance.searchUsers(searchUsersParameters);

        expect(response2).toEqual(defaultSearchUsersRepositoryResult);

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

    test(`${CREATE_USER_FUNCTION_NAME} Valid input Happy case`, async () => {

        const roleName = 'User';

        const roleSequelizeResult = { id: 1, title: roleName } as Role;

        const userSequelizeResult = { id: 1, title: 'Mr', firstName: 'kenan', lastName: 'hancer', primaryEmail: 'kenan.hancer@somoglobal.com' } as User;

        mockedRole.findOne.mockResolvedValue(roleSequelizeResult);

        mockedUser.create.mockResolvedValue(userSequelizeResult);

        const parameters: CreateUserPersisterInput = { ...userSequelizeResult, telephoneNumber: userSequelizeResult.primaryEmail, roleName };

        const response = await UserProfileRepositoryV2.defaultInstance.createUser(parameters);

        expect(response).toEqual(userSequelizeResult);
    });

    test(`${CREATE_USER_FUNCTION_NAME} Invalid input for role field`, async () => {

        const roleName = 'User';

        mockedRole.findOne.mockResolvedValue(undefined as any);

        mockedUser.create.mockResolvedValue(defaultRoleSequelizeResult);

        const parameters: CreateUserPersisterInput = {
            title: 'Mr',
            firstName: 'kenan',
            lastName: 'hancer',
            primaryEmail: 'kenan.hancer@somoglobal.com',
            roleName
        };

        try {
            await UserProfileRepositoryV2.defaultInstance.createUser(parameters);

            throw new Error('Code never should come in this point');
        } catch (error: any) {
            expect(error.message).toEqual(`Error: Role title: ${roleName} does not exist`);
        }
    });
});
import { ClientAccount, Role, User } from '@dodsgroup/dods-model';
import {
    CreateUserPersisterInput,
    GetUserClientAccounts,
    GetUserInput,
    SearchUsersInput,
    UserAccountsReponse,
} from '../../../src/domain';
import {
    DODS_USER,
    UserProfileRepositoryV2,
} from '../../../src/repositories/UserProfileRepositoryV2';

import { mocked } from 'ts-jest/utils';

const defaultRoleSequelizeResult = { id: 1, uuid: DODS_USER } as Role;

const defaultSearchUsersSequelizeResult = {
    rows: [
        {
            uuid: '24e7ca86-1788-4b6e-b153-9c963dc921we',
            firstName: 'Test First Name1',
            lastName: 'Test Last Name1',
            primaryEmail: '',
            role: { uuid: DODS_USER, title: '' },
            isDodsUser: true,
        } as any,
        {
            uuid: '24e7ca86-1788-4b6e-b153-9c963dc922ew',
            firstName: 'Test First Name2',
            lastName: 'Test Last Name2',
            primaryEmail: '',
            role: { uuid: DODS_USER, title: '' },
            isDodsUser: true,
        } as any,
    ],
    count: 2,
};

const defaultSearchUsersRepositoryResult = {
    users: defaultSearchUsersSequelizeResult.rows.map(
        ({
            uuid,
            firstName,
            lastName,
            primaryEmail,
            role,
            isDodsUser,
            secondaryEmail,
            telephoneNumber1,
            telephoneNumber2,
            title,
        }) => ({
            uuid,
            firstName,
            lastName,
            primaryEmail,
            secondaryEmail,
            telephoneNumber1,
            telephoneNumber2,
            role: {
                uuid: DODS_USER,

                title: role.title,
                dodsRole: undefined,
            },
            isDodsUser,
            title,
            clientAccount: {},
        })
    ),
    count: defaultSearchUsersSequelizeResult.count,
};

const defaultClientAccountsSequelizeResult = {
    rows: [
        {
            uuid: '3ba1e07c-7ad6-425f-a79d-7b3b08eccdb1',
            name: 'Company1',
            notes: 'test note',
        } as ClientAccount,
    ],
    count: 1,
};

jest.mock('@dodsgroup/dods-model');

const mockedUser = mocked(User);
const mockedRole = mocked(Role);
const mockedClient = mocked(ClientAccount);

mockedUser.findAndCountAll.mockResolvedValue(defaultSearchUsersSequelizeResult);

const CLASS_NAME = UserProfileRepositoryV2.name;
const SEARCH_USERS_FUNCTION_NAME = UserProfileRepositoryV2.defaultInstance.searchUsers.name;
const CREATE_USER_FUNCTION_NAME = UserProfileRepositoryV2.defaultInstance.createUser.name;
const GET_USER_FUNCTION_NAME = UserProfileRepositoryV2.defaultInstance.getUser.name;

const GET_ACCOUNT_BY_USER = UserProfileRepositoryV2.defaultInstance.getUserClientAccounts.name;

afterAll(() => {
    mockedRole.mockClear();
    mockedClient.mockClear();
});

describe(`${CLASS_NAME}`, () => {
    test(`${SEARCH_USERS_FUNCTION_NAME} Valid input Happy case`, async () => {
        const searchUsersParameters: SearchUsersInput = {};

        const response = await UserProfileRepositoryV2.defaultInstance.searchUsers(
            searchUsersParameters
        );

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
            sortDirection: 'ASC',
            clientAccountId: 'client-account-id',
            isActive: 'true',
        };

        const response1 = await UserProfileRepositoryV2.defaultInstance.searchUsers(
            searchUsersParameters
        );

        expect(response1).toEqual(defaultSearchUsersRepositoryResult);

        searchUsersParameters.sortBy = 'account';

        const response2 = await UserProfileRepositoryV2.defaultInstance.searchUsers(
            searchUsersParameters
        );

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
            sortDirection: 'ASC',
        };

        try {
            await UserProfileRepositoryV2.defaultInstance.searchUsers(searchUsersParameters);

            throw new Error('Code never should come in this point');
        } catch (error: any) {
            expect(error.message).toEqual(
                `Error: RoleUuid ${searchUsersParameters.role} does not exist`
            );
        }
    });

    test(`${CREATE_USER_FUNCTION_NAME} Valid input Happy case`, async () => {
        const roleSequelizeResult = { id: 1, title: 'test role' } as Role;

        const userSequelizeResult = {
            id: 1,
            title: 'Mr',
            firstName: 'kenan',
            lastName: 'hancer',
            primaryEmail: 'kenan.hancer@somoglobal.com',
        } as User;

        mockedRole.findOne.mockResolvedValue(roleSequelizeResult);

        mockedUser.create.mockResolvedValue(userSequelizeResult);

        const parameters: CreateUserPersisterInput = {
            ...userSequelizeResult,
            telephoneNumber1: userSequelizeResult.primaryEmail,
            telephoneNumber2: userSequelizeResult.primaryEmail,
            roleId: roleSequelizeResult.id.toString(),
        };

        const response = await UserProfileRepositoryV2.defaultInstance.createUser(parameters);

        expect(response).toEqual(userSequelizeResult);
    });

    test(`${CREATE_USER_FUNCTION_NAME} Invalid input for role field`, async () => {
        mockedRole.findOne.mockResolvedValue(undefined as any);

        mockedUser.create.mockResolvedValue(defaultRoleSequelizeResult);

        const parameters: CreateUserPersisterInput = {
            title: 'Mr',
            firstName: 'kenan',
            lastName: 'hancer',
            primaryEmail: 'kenan.hancer@somoglobal.com',
            roleId: 'test',
        };

        try {
            await UserProfileRepositoryV2.defaultInstance.createUser(parameters);

            throw new Error('Code never should come in this point');
        } catch (error: any) {
            expect(error.message).toEqual(`Error: Role uuid: ${parameters.roleId} does not exist`);
        }
    });

    test(`${GET_USER_FUNCTION_NAME} Valid input Happy case`, async () => {
        const findOneInUserResponse = {
            firstName: 'kenan',
            lastName: 'hancer',
            primaryEmail: 'kh@kh.com',
            role: {
                uuid: DODS_USER,
                title: 'test role',
            },
        } as any;

        mockedUser.findOne.mockResolvedValue(findOneInUserResponse);

        const parameters: GetUserInput = {
            userId: '24e7ca86-1788-4b6e-b153-9c963dc922ew',
        };

        const expectedResponse: any = {
            firstName: findOneInUserResponse.firstName,
            lastName: findOneInUserResponse.lastName,
            primaryEmail: findOneInUserResponse.primaryEmail,
            clientAccount: { name: undefined, uuid: undefined, teamMemberType: undefined },

            role: {
                uuid: '83618280-9c84-441c-94d1-59e4b24cbe3d',
                dodsRole: undefined,
                title: findOneInUserResponse.role.title,
            },
            isDodsUser: findOneInUserResponse.role.uuid === DODS_USER,
        };

        const response = await UserProfileRepositoryV2.defaultInstance.getUser(parameters);

        expect(response).toEqual(expectedResponse);
    });

    test(`${GET_USER_FUNCTION_NAME} Invalid input for uuid field`, async () => {
        mockedUser.findOne.mockResolvedValue(undefined as any);

        const parameters: GetUserInput = {
            userId: '24e7ca86-1788-4b6e-b153-9c963dc922ew',
        };

        try {
            await UserProfileRepositoryV2.defaultInstance.getUser(parameters);

            throw new Error('Code never should come in this point');
        } catch (error: any) {
            expect(error.message).toEqual(`Error: UserUUID ${parameters.userId} does not exist`);
        }
    });

    test(`${GET_ACCOUNT_BY_USER} invalid input Happy case`, async () => {
        const findAllClientsResponse = {
            uuid: '3ba1e07c-7ad6-425f-a79d-7b3b08eccdb1',
        } as any;

        mockedClient.findAll.mockResolvedValue(findAllClientsResponse);

        mockedClient.findAndCountAll.mockResolvedValue(defaultClientAccountsSequelizeResult);

        const parameters: GetUserClientAccounts = {
            userId: '24e7ca86-1788-4b6e-b153-9c963dc922ew',
        };

        try {
            await UserProfileRepositoryV2.defaultInstance.getUserClientAccounts(parameters);

            throw new Error('Code never should come in this point');
        } catch (error: any) {
            expect(error.message).toEqual(`Error: UserUUID ${parameters.userId} does not exist`);
        }
    });

    test(`${GET_ACCOUNT_BY_USER} valid input Happy case`, async () => {
        const findAllClientsResponse: Array<any> = [
            {
                uuid: '3ba1e07c-7ad6-425f-a79d-7b3b08eccdb1',
                name: 'Company1',
                notes: 'test note',
                subscription: {},
            },
        ];
        const findOneInUserResponse = {
            firstName: 'kenan',
            lastName: 'hancer',
            primaryEmail: 'kh@kh.com',
            role: {
                uuid: DODS_USER,
                title: 'test role',
            },
        } as any;

        mockedUser.findOne.mockResolvedValue(findOneInUserResponse);
        mockedClient.findAll.mockResolvedValue(findAllClientsResponse);

        mockedClient.findAndCountAll.mockResolvedValue(defaultClientAccountsSequelizeResult);

        const parameters: GetUserClientAccounts = {
            userId: '24e7ca86-1788-4b6e-b153-9c963dc922ew',
        };

        const clients = [
            {
                uuid: '3ba1e07c-7ad6-425f-a79d-7b3b08eccdb1',
                name: 'Company1',
                notes: 'test note',
                subscription: { name: undefined, uuid: undefined },
                teamMemberType: 0,
                collections: 0,
                team: [],
            },
        ];

        const expectedResponse: UserAccountsReponse = {
            totalRecords: 1,
            filteredRecords: 1,
            clients: clients,
        };

        const response = await UserProfileRepositoryV2.defaultInstance.getUserClientAccounts(
            parameters
        );

        expect(response).toEqual(expectedResponse);
    });
});

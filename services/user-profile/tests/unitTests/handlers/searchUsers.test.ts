import {
    HttpResponse,
    HttpStatusCode,
    createContext,
} from '@dodsgroup/dods-lambda';
import { SearchUsersInput, SearchUsersOutput } from '../../../src/domain';

import { UserProfileRepositoryV2 } from '../../../src/repositories';
import { mocked } from 'ts-jest/utils';
import { searchUsers } from '../../../src/handlers/searchUsers/searchUsers';

const defaultContext = createContext();

const defaultSearchUsersRepositoryResult: SearchUsersOutput = {
    users: [
        {
            uuid: '24e7ca86-1788-4b6e-b153-9c963dc921we',
            firstName: 'Test First Name1',
            lastName: 'Test Last Name1',
            primaryEmail: 'mark@ex.com',
            secondaryEmail: 'mark@ex.com',
            telephoneNumber1: '+1872111727',
            telephoneNumber2: '+1872111728',
            title: 'Mr',
            role: {
                uuid: '10c4c886-97a5-4dd1-93e7-7a51df1e9861',
                title: 'User',
                dodsRole: 0,
            },
            clientAccount: {
                uuid: '6c0e0f58-aff8-4d0d-9a20-53215aee61cc',
                name: 'Company2',
            },
            isDodsUser: false,
        },
        {
            uuid: '24e7ca86-1788-4b6e-b153-9c963dc922ew',
            firstName: 'Test First Name2',
            lastName: 'Test Last Name2',
            primaryEmail: 'mark@ex.com',
            secondaryEmail: 'mark@ex.com',
            telephoneNumber1: '+1872111727',
            telephoneNumber2: '+1872111728',
            title: 'Mr',
            role: {
                uuid: '10c4c886-97a5-4dd1-93e7-7a51df1e9861',
                title: 'User',
                dodsRole: 0,
            },
            clientAccount: {
                uuid: '6c0e0f58-aff8-4d0d-9a20-53215aee61cc',
                name: 'Company2',
            },

            isDodsUser: true,
        },
    ],
    count: 2,
};

jest.mock('../../../src/repositories/UserProfileRepositoryV2');

const mockedUserProfileRepostiroyV2 = mocked(UserProfileRepositoryV2, true);

const FUNCTION_NAME = searchUsers.name;

afterAll(() => {
    mockedUserProfileRepostiroyV2.mockReset();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input', async () => {
        mockedUserProfileRepostiroyV2.defaultInstance.searchUsers.mockResolvedValue(
            defaultSearchUsersRepositoryResult
        );

        const searchUsersInput: SearchUsersInput = {};

        const searchUsersResult = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'User Profile List',
            limit: 30,
            offset: 0,
            totalRecords: defaultSearchUsersRepositoryResult.count,
            data: defaultSearchUsersRepositoryResult.users,
        });

        const response = await searchUsers(searchUsersInput, defaultContext);

        expect(response).toEqual(searchUsersResult);
    });

    test('Valid input - with name field only', async () => {
        mockedUserProfileRepostiroyV2.defaultInstance.searchUsers.mockResolvedValue(
            defaultSearchUsersRepositoryResult
        );

        const searchUsersInput: SearchUsersInput = { name: 'test' };

        const searchUsersResult = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'User Profile List',
            limit: 30,
            offset: 0,
            totalRecords: defaultSearchUsersRepositoryResult.count,
            data: defaultSearchUsersRepositoryResult.users,
        });

        const response = await searchUsers(searchUsersInput, defaultContext);

        expect(response).toEqual(searchUsersResult);
    });

    test('Valid input - with search filter fields', async () => {
        const searchUsersRepositoryResult: SearchUsersOutput = {
            users: [
                {
                    uuid: '24e7ca86-1788-4b6e-b153-9c963dc921we',
                    firstName: 'Test First Name1',
                    lastName: 'Test Last Name1',
                    primaryEmail: 'mark@ex.com',
                    secondaryEmail: 'mark@ex.com',
                    telephoneNumber1: '+1872111727',
                    telephoneNumber2: '+1872111728',
                    title: 'Mr',
                    role: {
                        uuid: '10c4c886-97a5-4dd1-93e7-7a51df1e9861',
                        title: 'User',
                        dodsRole: 0,
                    },
                    clientAccount: {
                        uuid: '6c0e0f58-aff8-4d0d-9a20-53215aee61cc',
                        name: 'Company2',
                    },

                    isDodsUser: false,
                },
                {
                    uuid: '24e7ca86-1788-4b6e-b153-9c963dc922ew',
                    firstName: 'Test First Name2',
                    lastName: 'Test Last Name2',
                    primaryEmail: 'mark@ex.com',
                    secondaryEmail: 'mark@ex.com',
                    telephoneNumber1: '+1872111727',
                    telephoneNumber2: '+1872111728',
                    title: 'Mr',
                    role: {
                        uuid: '10c4c886-97a5-4dd1-93e7-7a51df1e9861',
                        title: 'User',
                        dodsRole: 0,
                    },
                    clientAccount: {
                        uuid: '6c0e0f58-aff8-4d0d-9a20-53215aee61cc',
                        name: 'Company2',
                    },

                    isDodsUser: true,
                },
                {
                    uuid: '24e7ca86-1788-4b6e-b153-9c963dc922ew',
                    firstName: 'Test First Name3',
                    lastName: 'Test Last Name3',
                    primaryEmail: 'mark@ex.com',
                    secondaryEmail: 'mark@ex.com',
                    telephoneNumber1: '+1872111727',
                    telephoneNumber2: '+1872111728',
                    title: 'Mr',
                    role: {
                        uuid: '10c4c886-97a5-4dd1-93e7-7a51df1e9861',
                        title: 'User',
                        dodsRole: 0,
                    },
                    clientAccount: {
                        uuid: '6c0e0f58-aff8-4d0d-9a20-53215aee61cc',
                        name: 'Company2',
                    },

                    isDodsUser: true,
                },
                {
                    uuid: '24e7ca86-1788-4b6e-b153-9c963dc922ew',
                    firstName: 'Test First Name4',
                    lastName: 'Test Last Name4',
                    primaryEmail: 'mark@ex.com',
                    secondaryEmail: 'mark@ex.com',
                    telephoneNumber1: '+1872111727',
                    telephoneNumber2: '+1872111728',
                    title: 'Mr',
                    role: {
                        uuid: '10c4c886-97a5-4dd1-93e7-7a51df1e9861',
                        title: 'User',
                        dodsRole: 0,
                    },
                    clientAccount: {
                        uuid: '6c0e0f58-aff8-4d0d-9a20-53215aee61cc',
                        name: 'Company2',
                    },

                    isDodsUser: true,
                },
            ],
            count: 5,
        };

        mockedUserProfileRepostiroyV2.defaultInstance.searchUsers.mockResolvedValue(
            searchUsersRepositoryResult
        );

        const searchUsersInput: SearchUsersInput = {
            name: 'test',
            limit: 10,
            offset: 2,
            sortBy: 'firstName',
            sortDirection: 'DESC',
        };

        const searchUsersResult = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'User Profile List',
            limit: 10,
            offset: 2,
            totalRecords: searchUsersRepositoryResult.count,
            data: searchUsersRepositoryResult.users,
        });

        const response = await searchUsers(searchUsersInput, defaultContext);

        expect(response).toEqual(searchUsersResult);
    });
});

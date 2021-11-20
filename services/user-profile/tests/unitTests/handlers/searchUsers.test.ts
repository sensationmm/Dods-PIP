import { searchUsers } from '../../../src/handlers/searchUsers/searchUsers';
import { UserProfileRepositoryV2 } from '../../../src/repositories';
import { mocked } from 'ts-jest/utils';
import { createContext, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { SearchUsersInput, SearchUsersOutput } from '../../../src/domain';

const defaultContext = createContext();

const defaultSearchUsersRepositoryResult: SearchUsersOutput = {
    users: [
        { uuid: '24e7ca86-1788-4b6e-b153-9c963dc921we', firstName: 'Test First Name1', lastName: 'Test Last Name1', email: '', role: '' },
        { uuid: '24e7ca86-1788-4b6e-b153-9c963dc922ew', firstName: 'Test First Name2', lastName: 'Test Last Name2', email: '', role: '' },
    ],
    count: 2
};

jest.mock('../../../src/repositories/UserProfileRepositoryV2');

const mockedUserProfileRepostiroyV2 = mocked(UserProfileRepositoryV2, true);

const FUNCTION_NAME = searchUsers.name;

afterAll(() => {
    mockedUserProfileRepostiroyV2.mockReset();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input', async () => {
        mockedUserProfileRepostiroyV2.defaultInstance.searchUsers.mockResolvedValue(defaultSearchUsersRepositoryResult);

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
        mockedUserProfileRepostiroyV2.defaultInstance.searchUsers.mockResolvedValue(defaultSearchUsersRepositoryResult);

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
                { uuid: '24e7ca86-1788-4b6e-b153-9c963dc921we', firstName: 'Test First Name1', lastName: 'Test Last Name1', email: 'email1@email1.com', role: '' },
                { uuid: '24e7ca86-1788-4b6e-b153-9c963dc922ew', firstName: 'Test First Name2', lastName: 'Test Last Name2', email: 'email2@email2.com', role: '' },
                { uuid: '24e7ca86-1788-4b6e-b153-9c963dc922ew', firstName: 'Test First Name3', lastName: 'Test Last Name3', email: 'email3@email3.com', role: '' },
                { uuid: '24e7ca86-1788-4b6e-b153-9c963dc922ew', firstName: 'Test First Name4', lastName: 'Test Last Name4', email: 'email4@email4.com', role: '' },
            ],
            count: 5
        };

        mockedUserProfileRepostiroyV2.defaultInstance.searchUsers.mockResolvedValue(searchUsersRepositoryResult);

        const searchUsersInput: SearchUsersInput = {
            name: 'test',
            limit: 10,
            offset: 2,
            sortBy: 'firstName',
            sortDirection: 'DESC'
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


import { searchUsers } from '../../../src/handlers/searchUsers/searchUsers';
import { UserProfileRepositoryV2 } from '../../../src/repositories/UserProfileRepositoryV2';
import { mocked } from 'ts-jest/utils';
import { createContext, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

const defaultContext = createContext();

const defaultSearchUsersResult: Array<any> = [
    { id: 1, firstName: 'Test First Name1', lastName: 'Test Last Name1' },
    { id: 2, firstName: 'Test First Name2', lastName: 'Test Last Name2' },
];


jest.mock('../../../src/repositories/UserProfileRepositoryV2');

const mockedUserProfileRepostiroyV2 = mocked(UserProfileRepositoryV2, true);

mockedUserProfileRepostiroyV2.defaultInstance.searchUsers.mockResolvedValue(defaultSearchUsersResult);



const FUNCTION_NAME = searchUsers.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input - response should be "healthy"', async () => {
        const searchUsersResult = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'User Profile List',
            data: defaultSearchUsersResult,
        });

        const response = await searchUsers({ name: 'test' }, defaultContext);
        expect(response).toEqual(searchUsersResult);
    });
});


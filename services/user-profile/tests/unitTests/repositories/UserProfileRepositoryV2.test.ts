import { User } from '@dodsgroup/dods-model';
import { mocked } from 'ts-jest/utils';

import { UserProfileRepositoryV2 } from '../../../src/repositories/UserProfileRepositoryV2';

const defaultSearchUsersResult: Array<any> = [
    { uuid: '14e7ca86-1788-4b6e-b153-9c963dc928cb', firstName: 'Test First Name1', lastName: 'Test Last Name1' },
    { uuid: '24e7ca86-1788-4b6e-b153-9c963dc928cb', firstName: 'Test First Name2', lastName: 'Test Last Name2' },
];

jest.mock('@dodsgroup/dods-model');

const mockedUser = mocked(User);

mockedUser.findAll.mockResolvedValue(defaultSearchUsersResult);

const CLASS_NAME = UserProfileRepositoryV2.name;
const SEARCH_USERS_FUNCTION_NAME = UserProfileRepositoryV2.defaultInstance.searchUsers.name;

describe(`${CLASS_NAME}`, () => {
    test(`${SEARCH_USERS_FUNCTION_NAME} Valid input Happy case`, async () => {
        const response = await UserProfileRepositoryV2.defaultInstance.searchUsers({ name: 'test' });
        expect(response).toEqual(defaultSearchUsersResult);
    });
});
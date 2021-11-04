import { UserProfileRepository } from '../../../src/repositories';
import { UserProfileModel } from '../../../src/db/models';
import { mocked } from 'ts-jest/utils';

const defaultUserProfile = {
    id: 1,
    uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3',
    firstName: 'kenan',
    lastName: 'hancer',
    title: 'Mr',
    roleId: 1,
    primaryEmail: 'k@h.com',
} as UserProfileModel;

jest.mock('../../../src/db/models/UserProfile');

const mockedUserProfileModel = mocked(UserProfileModel, true);

mockedUserProfileModel.findOne.mockImplementation(
    async (findOptions) => {

        if ((findOptions?.where as any).uuid === 'b0605d89-6200-4861-a9d5-258ccb33cbe3') {
            return defaultUserProfile;
        }

        return null;
    }
);

const FUNCTION_NAME = UserProfileRepository.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid case `, async () => {

        const response = await UserProfileRepository.defaultInstance.findOne({ uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3' });

        expect(response).toEqual(defaultUserProfile);
    });

    test(`${FUNCTION_NAME} Invalid case `, async () => {

        try {
            await UserProfileRepository.defaultInstance.findOne({ uuid: '' });
            expect(true).toEqual(false);
        } catch (error: any) {
            expect(error.message).toEqual('Error: userProfile not found');
        }
    });
});

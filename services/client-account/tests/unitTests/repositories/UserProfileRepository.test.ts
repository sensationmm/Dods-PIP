import { UserProfileModel } from '../../../src/db/models';
import { UserProfileRepository } from '../../../src/repositories';
import { mocked } from 'ts-jest/utils';

const defaultUsersProfile = [
    {
        id: 1,
        uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3',
        firstName: 'kenan',
        lastName: 'hancer',
        title: 'Mr',
        roleId: 1,
        primaryEmail: 'k@h.com',
    } as UserProfileModel,
    {
        id: 2,
        uuid: '0a11a762-e3d7-4edd-83cc-6a8eb7bee65b',
        firstName: 'diego',
        lastName: 'avellaneda',
        title: 'Mr',
        roleId: 1,
        primaryEmail: 'd@a.com',
    } as UserProfileModel,
];

jest.mock('../../../src/db/models/UserProfile');

const mockedUserProfileModel = mocked(UserProfileModel, true);

mockedUserProfileModel.findOne.mockImplementation(async (findOptions) => {
    if (
        (findOptions?.where as any).uuid ===
        'b0605d89-6200-4861-a9d5-258ccb33cbe3'
    ) {
        return defaultUsersProfile[0];
    }

    return null;
});

const FUNCTION_NAME = UserProfileRepository.name;

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid case `, async () => {
        const response = await UserProfileRepository.defaultInstance.findOne({
            uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3',
        });

        expect(response).toEqual(defaultUsersProfile[0]);
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

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid case `, async () => {
        const primaryEmail = 'd@a.com';

        mockedUserProfileModel.findAll.mockImplementation(async () => {
            return [];
        });

        const response =
            await UserProfileRepository.defaultInstance.checkUserEmailAvailability(
                primaryEmail
            );

        expect(response).toEqual(true);
    });

    test(`${FUNCTION_NAME} Invalid case `, async () => {
        const primaryEmail = '';

        mockedUserProfileModel.findAll.mockImplementation(async () => {
            return defaultUsersProfile;
        });

        const response =
            await UserProfileRepository.defaultInstance.checkUserEmailAvailability(
                primaryEmail
            );

        expect(response).toEqual(false);
    });
});

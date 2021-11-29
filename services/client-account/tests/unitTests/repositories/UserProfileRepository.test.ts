import {
    CreateUserOutput,
    CreateUserPersisterInput,
} from '../../../src/domain';

import { UserProfileModel } from '../../../src/db/models';
import { UserProfileRepository } from '../../../src/repositories';
import axios from 'axios';
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

jest.mock('axios');
jest.mock('../../../src/db/models/UserProfile');

const mockedAxios = mocked(axios, true);
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

const CLASS_NAME = UserProfileRepository.name;
const FIND_ONE_FUNCTION_NAME =
    UserProfileRepository.defaultInstance.findOne.name;
const CHECK_USER_AVAILABILITY_FUNCTION_NAME =
    UserProfileRepository.defaultInstance.checkUserEmailAvailability.name;
const CREATE_USER_FUNCTION_NAME =
    UserProfileRepository.defaultInstance.createUser.name;

afterEach(() => {
    mockedAxios.post.mockClear();
});

describe(`${CLASS_NAME} handler`, () => {
    test(`${FIND_ONE_FUNCTION_NAME} Valid case `, async () => {
        const response = await UserProfileRepository.defaultInstance.findOne({
            uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3',
        });

        expect(response).toEqual(defaultUsersProfile[0]);
    });

    test(`${FIND_ONE_FUNCTION_NAME} Invalid case `, async () => {
        try {
            await UserProfileRepository.defaultInstance.findOne({ uuid: '' });
            expect(true).toEqual(false);
        } catch (error: any) {
            expect(error.message).toEqual('Error: userProfile not found');
        }
    });

    test(`${CHECK_USER_AVAILABILITY_FUNCTION_NAME} Valid case `, async () => {
        const primaryEmail = 'd@a.com';

        mockedUserProfileModel.findAll.mockResolvedValue([]);

        const response =
            await UserProfileRepository.defaultInstance.checkUserEmailAvailability(
                primaryEmail
            );

        expect(response).toEqual(true);
    });

    test(`${CHECK_USER_AVAILABILITY_FUNCTION_NAME} Invalid case `, async () => {
        const primaryEmail = '';

        mockedUserProfileModel.findAll.mockResolvedValue(defaultUsersProfile);

        const response =
            await UserProfileRepository.defaultInstance.checkUserEmailAvailability(
                primaryEmail
            );

        expect(response).toEqual(false);
    });

    test(`${CREATE_USER_FUNCTION_NAME} Valid case `, async () => {
        const title = 'Mr';
        const firstName = 'Kenan';
        const lastName = 'Hancer';
        const roleId = 'test';
        const primaryEmail = 'kenanhancer@hotmail.com';
        const userId = 'test';
        const clientAccountId = 'test';
        const clientAccountName = 'test';

        const createdUserData: CreateUserOutput = {
            roleId,
            displayName: `${firstName} ${lastName}`,
            userId,
            emailAddress: primaryEmail,
            userName: primaryEmail,
            clientAccount: {
                id: clientAccountId,
                name: clientAccountName,
            },
        };

        const data = { success: true, user: createdUserData };

        mockedAxios.post.mockResolvedValue({ data } as any);

        const createUserParameter: CreateUserPersisterInput = {
            title,
            firstName,
            lastName,
            roleId,
            primaryEmail,
        };

        const response = await UserProfileRepository.defaultInstance.createUser(
            createUserParameter
        );

        expect(mockedAxios.post).toHaveBeenCalledTimes(1);

        expect(response).toEqual({
            success: true,
            data: createdUserData,
            error: undefined,
        });
    });
});

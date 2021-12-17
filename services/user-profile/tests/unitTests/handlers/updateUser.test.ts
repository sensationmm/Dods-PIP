import {
    ClientAccountServiceRepository,
    IamRepository,
    UserProfileRepositoryV2,
} from '../../../src/repositories';
import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';
import { UpdateUserInput, UserProfileError } from '../../../src/domain';

import { User } from '@dodsgroup/dods-model';
import { mocked } from 'ts-jest/utils';
import { updateUser } from '../../../src/handlers/updateUser/updateUser';

const defaultContext = createContext();

const defaultUpdateUserRepositoryResult = {
    uuid: 'updatedUser',
    title: 'Mr',
    firstName: 'kenan',
    lastName: 'hancer',
    primaryEmail: 'kenan.hancer@somoglobal.com',
    secondaryEmail: 'kenan.hancer+1@somogloblal.com',
    telephoneNumber1: '+1234567890',
    telephoneNumber2: '+1234567890',
    isActive: true,
} as User;

const defaultGetUserRepositoryResult = {
    ...defaultUpdateUserRepositoryResult,
    isDodsUser: false,
    clientAccount: {
        uuid: 'test',
        name: 'test',
        teamMemberType: 3,
    },
    clientAccountId: 'test',
    memberSince: new Date(),
};

jest.mock('../../../src/repositories/UserProfileRepositoryV2');
jest.mock('../../../src/repositories/IamRepository');
jest.mock('../../../src/repositories/ClientAccountServiceRepository');

const mockedUserProfileRepositoryV2 = mocked(UserProfileRepositoryV2, true);
const mockedIamRepository = mocked(IamRepository, true);
const mockedClientAccountServiceRepository = mocked(ClientAccountServiceRepository, true);

const FUNCTION_NAME = updateUser.name;

afterEach(() => {
    mockedIamRepository.mockClear();
    mockedUserProfileRepositoryV2.mockClear();
    mockedClientAccountServiceRepository.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input, isActive unchanged', async () => {
        mockedUserProfileRepositoryV2.defaultInstance.getUser.mockResolvedValue(
            defaultGetUserRepositoryResult
        );
        mockedUserProfileRepositoryV2.defaultInstance.updateUser.mockResolvedValue(
            defaultUpdateUserRepositoryResult
        );

        const updateUserInput: UpdateUserInput = {
            userId: 'updatedUser',
            title: 'Mr',
            firstName: 'kenan',
            lastName: 'hancer',
        };

        const updateUserResult = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'User updated successfully',
            user: {
                uuid: 'updatedUser',
                title: 'Mr',
                firstName: 'kenan',
                lastName: 'hancer',
                primaryEmail: 'kenan.hancer@somoglobal.com',
                secondaryEmail: 'kenan.hancer+1@somogloblal.com',
                telephoneNumber1: '+1234567890',
                telephoneNumber2: '+1234567890',
                isActive: true,
            },
        });

        const response = await updateUser(updateUserInput, defaultContext);

        expect(response).toEqual(updateUserResult);
    });

    test('Valid input, isActive set to true', async () => {
        mockedUserProfileRepositoryV2.defaultInstance.getUser.mockResolvedValue(
            defaultGetUserRepositoryResult
        );

        mockedUserProfileRepositoryV2.defaultInstance.updateUser.mockResolvedValue(
            defaultUpdateUserRepositoryResult
        );
        mockedIamRepository.defaultInstance.enableUser.mockResolvedValue();
        mockedClientAccountServiceRepository.defaultInstance.getRemainingSeats.mockResolvedValue(1);

        const updateUserInput: UpdateUserInput = {
            userId: 'updatedUser',
            title: 'Mr',
            firstName: 'kenan',
            lastName: 'hancer',
            isActive: true,
        };

        await updateUser(updateUserInput, defaultContext);

        expect(ClientAccountServiceRepository.defaultInstance.getRemainingSeats).toBeCalled();
        expect(IamRepository.defaultInstance.enableUser).toBeCalled();
    });

    test('Valid input, isActive set to false', async () => {
        mockedUserProfileRepositoryV2.defaultInstance.getUser.mockResolvedValue(
            defaultGetUserRepositoryResult
        );
        mockedUserProfileRepositoryV2.defaultInstance.updateUser.mockResolvedValue(
            defaultUpdateUserRepositoryResult
        );
        mockedIamRepository.defaultInstance.enableUser.mockResolvedValue();

        const updateUserInput: UpdateUserInput = {
            userId: 'updatedUser',
            title: 'Mr',
            firstName: 'kenan',
            lastName: 'hancer',
            isActive: false,
        };

        await updateUser(updateUserInput, defaultContext);

        expect(IamRepository.defaultInstance.disableUser).toBeCalled();
    });

    test('Invalid input, bad userId', async () => {
        const errorMessage = 'BadInputError';
        mockedUserProfileRepositoryV2.defaultInstance.updateUser.mockImplementation(async () => {
            throw new UserProfileError(errorMessage);
        });

        const updateUserInput: UpdateUserInput = {
            userId: 'updatedUser',
            title: 'Mr',
            firstName: 'kenan',
            lastName: 'hancer',
        };

        const badInputResponse = new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: errorMessage,
        });

        const response = await updateUser(updateUserInput, defaultContext);

        expect(response).toEqual(badInputResponse);
    });

    test('Service Error, bad IAM service response', async () => {
        const errorObject = {
            message: 'HttpError',
            response: {
                data: {
                    error: 'Service Unavailable',
                },
            },
        };
        mockedUserProfileRepositoryV2.defaultInstance.getUser.mockResolvedValue(
            defaultGetUserRepositoryResult
        );
        mockedUserProfileRepositoryV2.defaultInstance.updateUser.mockResolvedValue(
            defaultUpdateUserRepositoryResult
        );
        mockedIamRepository.defaultInstance.enableUser.mockImplementation(async () => {
            throw errorObject;
        });

        const updateUserInput: UpdateUserInput = {
            userId: 'updatedUser',
            title: 'Mr',
            firstName: 'kenan',
            lastName: 'hancer',
            isActive: true,
        };

        const serviceErrorResponse = new HttpResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, {
            success: false,
            message: `Cognito Error: ${JSON.stringify(errorObject.response.data.error)}`,
        });

        const response = await updateUser(updateUserInput, defaultContext);

        expect(response).toEqual(serviceErrorResponse);
    });

    test('Service Error, general error', async () => {
        const errorMessage = 'GeneralError';
        mockedUserProfileRepositoryV2.defaultInstance.updateUser.mockImplementation(async () => {
            throw new Error(errorMessage);
        });

        const updateUserInput: UpdateUserInput = {
            userId: 'updatedUser',
            title: 'Mr',
            firstName: 'kenan',
            lastName: 'hancer',
        };

        try {
            await updateUser(updateUserInput, defaultContext);
            expect(true).toBe(false);
        } catch (error) {
            expect(error).toHaveProperty('message', errorMessage);
        }
    });
});

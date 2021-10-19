import { HttpResponse, HttpStatusCode, createContext } from '@dodsgroup/dods-lambda';

import { UserProfileCreate } from '../../../src/domain';
import { UserProfileRepository } from '../../../src/repositories';
import { createUserProfile } from '../../../src/handlers/createUserProfile/createUserProfile';
import { mocked } from 'ts-jest/utils';

const FUNCTION_NAME = createUserProfile.name;

const SUCCESS_PROFILE_RESPONSE = {
    id: '0e6c0561-8ff1-4f74-93bc-77444b156c6f',
    title: 'Sir.',
    first_name: 'Other',
    last_name: 'Tester',
    primary_email_address: 'dodstestlocal1@mailinator.com',
    secondary_email_address: 'dodstestlocal2@mailinator.com',
    telephone_number_1: '+573214858576',
    telephone_number_2: '+573214858577',
    role: {
        id: '24e7ca86-1788-4b6e-b153-9c963dc928cb',
        title: 'Regular User',
        dods_role: false,
    },
};

const SUCCESS_PROFILE_REQUEST = {
    title: 'Sir.',
    first_name: 'Other',
    last_name: 'Tester',
    primary_email_address: 'dodstestlocal1@mailinator.com',
    secondary_email_address: 'dodstestlocal2@mailinator.com',
    telephone_number_1: '+573214858576',
    telephone_number_2: '+573214858577',
    role_id: '24e7ca86-1788-4b6e-b153-9c963dc928cb',
};

jest.mock('../../../src/repositories/UserProfileRepository');

const mockedUserProfileRepository = mocked(UserProfileRepository, true);

const createUserProfileMock = async (params: UserProfileCreate) => {
    if (params.first_name === 'Error Generator') {
        throw new Error('General error');
    }

    return SUCCESS_PROFILE_RESPONSE;
};

const defaultContext = createContext();

beforeEach(() => {
    mockedUserProfileRepository.defaultInstance.createUserProfile.mockImplementation(
        createUserProfileMock
    );
});

afterEach(() => {
    mockedUserProfileRepository.defaultInstance.createUserProfile.mockClear();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test(`${FUNCTION_NAME} Valid input`, async () => {
        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'User Profile successfully created.',
            data: SUCCESS_PROFILE_RESPONSE,
        });

        const response = await createUserProfile(SUCCESS_PROFILE_REQUEST, defaultContext);

        expect(response).toEqual(expectedResponse);

        expect(mockedUserProfileRepository.defaultInstance.createUserProfile).toHaveBeenCalledTimes(
            1
        );
    });
});

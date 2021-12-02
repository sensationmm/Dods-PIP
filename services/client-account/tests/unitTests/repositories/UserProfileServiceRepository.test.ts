import { UserProfileServiceRepository } from '../../../src/repositories/UserProfileServiceRepository';
import axios from 'axios';
import { mocked } from 'ts-jest/utils';

jest.mock("axios");

const mockedAxios = mocked(axios, true);

const CLASS_NAME = UserProfileServiceRepository.name;
const CREATE_USER_FUNCTION_NAME = UserProfileServiceRepository.defaultInstance.createUser.name;


afterEach(() => {
    mockedAxios.post.mockClear();
});

describe(`${CLASS_NAME}`, () => {

    test(`${CREATE_USER_FUNCTION_NAME} Valid case`, async () => {
        mockedAxios.post.mockResolvedValue({ data: { success: true, data: {} } });

        await UserProfileServiceRepository.defaultInstance.createUser({ email: 'kenanhancer@hotmail.com' });

        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    test(`${CREATE_USER_FUNCTION_NAME} Invalid case`, async () => {
        mockedAxios.post.mockResolvedValue({ data: { success: false, data: {} } });

        await UserProfileServiceRepository.defaultInstance.createUser({ email: 'kenanhancer@hotmail.com' });

        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
});
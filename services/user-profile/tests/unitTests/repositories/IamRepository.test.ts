import { IamRepository } from '../../../src/repositories/IamRepository';
import axios from 'axios';
import { mocked } from 'ts-jest/utils';

jest.mock("axios");

const mockedAxios = mocked(axios, true);

const CLASS_NAME = IamRepository.name;
const CREATE_USER_FUNCTION_NAME = IamRepository.defaultInstance.createUser.name;

afterEach(() => {
    mockedAxios.post.mockClear();
});

describe(`${CLASS_NAME}`, () => {

    test(`${CREATE_USER_FUNCTION_NAME} Valid input Happy case`, async () => {

        const email = 'kenan.hancer@somoglobal.com';
        const clientAccountId = '1';
        const clientAccountName = 'User';

        const data = { success: true, data: { userName: 'kenan' } };

        mockedAxios.post.mockResolvedValue({ data } as any)

        const response = await IamRepository.defaultInstance.createUser(email, clientAccountId, clientAccountName);

        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        
        expect(response).toEqual({ ...data, error: undefined });
    });
});
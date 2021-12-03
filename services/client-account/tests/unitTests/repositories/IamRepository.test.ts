import { IamRepository } from '../../../src/repositories/IamRepository';
import axios from 'axios';
import { mocked } from 'ts-jest/utils';

jest.mock("axios");

const mockedAxios = mocked(axios, true);

const CLASS_NAME = IamRepository.name;
const DESTROY_USER_FUNCTION_NAME = IamRepository.defaultInstance.destroyUser.name;

afterEach(() => {
    mockedAxios.post.mockClear();
});

describe(`${CLASS_NAME}`, () => {

    test(`${DESTROY_USER_FUNCTION_NAME} Valid case`, async () => {

        await IamRepository.defaultInstance.destroyUser({ email: 'kenanhancer@hotmail.com' });

        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });
});
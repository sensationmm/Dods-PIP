import { createContext, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { mocked } from 'ts-jest/utils';
import { GetUserInput, GetUserOutput } from '../../../src/domain';
import { getUser } from '../../../src/handlers/getUser/getUser';
import { UserProfileRepositoryV2 } from '../../../src/repositories/UserProfileRepositoryV2';

jest.mock('../../../src/repositories/UserProfileRepositoryV2');

const mockedUserProfileRepositoryV2 = mocked(UserProfileRepositoryV2, true);

const defaultContext = createContext();

const FUNCTION_NAME = getUser.name;

describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid input', async () => {

        const getUserUserProfileRepositoryV2Response = {} as GetUserOutput;

        mockedUserProfileRepositoryV2.defaultInstance.getUser.mockResolvedValue(getUserUserProfileRepositoryV2Response);

        const parameters: GetUserInput = { userId: '' };

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'User Profile Found',
            data: getUserUserProfileRepositoryV2Response,
        });

        const response = await getUser(parameters, defaultContext)

        expect(response).toEqual(expectedResponse);
    });
});
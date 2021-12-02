import {
    GetUserClientAccounts,
    UserAccountsReponse,
} from '../../../src/domain';
import {
    HttpResponse,
    HttpStatusCode,
    createContext,
} from '@dodsgroup/dods-lambda';

import { UserProfileRepositoryV2 } from '../../../src/repositories/UserProfileRepositoryV2';
import { getClientAccountsByUser } from '../../../src/handlers/getClientAccountsByUser/getClientAccountsByUser';
import { mocked } from 'ts-jest/utils';

jest.mock('../../../src/repositories/UserProfileRepositoryV2');

const mockedUserProfileRepositoryV2 = mocked(UserProfileRepositoryV2, true);

const defaultContext = createContext();

const FUNCTION_NAME = getClientAccountsByUser.name;

describe(`${FUNCTION_NAME} handler`, () => {
    it('Valid input', async () => {
        const getAccountsByUserProfileRepositoryV2Response =
            {} as UserAccountsReponse;

        mockedUserProfileRepositoryV2.defaultInstance.getUserClientAccounts.mockResolvedValue(
            getAccountsByUserProfileRepositoryV2Response
        );

        const parameters: GetUserClientAccounts = { userId: '' };

        const expectedResponse = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Showing Results.',
            limit: '30',
            offset: '0',
            data: getAccountsByUserProfileRepositoryV2Response.clients,
        });

        const response = await getClientAccountsByUser(
            parameters,
            defaultContext
        );

        expect(response).toEqual(expectedResponse);
    });
});

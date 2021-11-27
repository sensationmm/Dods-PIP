import { createUser } from '../../../src/handlers/createUser/createUser';
import { UserProfileRepositoryV2, IamRepository } from '../../../src/repositories';
import { mocked } from 'ts-jest/utils';
import { createContext, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CreateUserInput } from '../../../src/domain';
import { User } from '@dodsgroup/dods-model';

const defaultContext = createContext();

const defaultCreateUserRepositoryResult = { id: 1, title: 'Mr', firstName: 'kenan', lastName: 'hancer', primaryEmail: 'kenan.hancer@somoglobal.com' } as User;


jest.mock('../../../src/repositories/UserProfileRepositoryV2');
jest.mock('../../../src/repositories/IamRepository');

const mockedUserProfileRepostiroyV2 = mocked(UserProfileRepositoryV2, true);
const mockedIamRepository = mocked(IamRepository, true);

const FUNCTION_NAME = createUser.name;

afterEach(() => {
    mockedIamRepository.mockClear();
    mockedUserProfileRepostiroyV2.mockReset();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input', async () => {
        const createUserIamRepositoryResult = { success: true, data: { userName: 'test' } };

        mockedIamRepository.defaultInstance.createUser.mockResolvedValue(createUserIamRepositoryResult);
        mockedUserProfileRepostiroyV2.defaultInstance.createUser.mockResolvedValue(defaultCreateUserRepositoryResult);

        const createUserInput: CreateUserInput = {
            title: 'Mr',
            firstName: 'kenan',
            lastName: 'hancer',
            primaryEmail: 'kenan.hancer@somoglobal.com',
            roleName: 'User',
            clientAccountId: '1',
            clientAccountName: 'User',
        };

        const createUserResult = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'User was created succesfully',
            User: {
                displayName: defaultCreateUserRepositoryResult.fullName,
                userName: defaultCreateUserRepositoryResult.primaryEmail,
                emailAddress: defaultCreateUserRepositoryResult.primaryEmail,
                userId: createUserIamRepositoryResult.data.userName,
                role: createUserInput.roleName,
                clientAccount: {
                    id: createUserInput.clientAccountId,
                    name: createUserInput.clientAccountName
                }
            }
        });

        const response = await createUser(createUserInput, defaultContext);

        expect(response).toEqual(createUserResult);
    });

    test('Invalid input', async () => {
        // const createUserIamRepositoryResult = { success: false, data: { userName: '' }, error: 'TEST' };

        mockedIamRepository.defaultInstance.createUser.mockImplementation(() => { throw { response: { data: { error: 'TEST' } } } });
        mockedUserProfileRepostiroyV2.defaultInstance.createUser.mockResolvedValue(defaultCreateUserRepositoryResult);

        const createUserInput: CreateUserInput = {
            title: 'Mr',
            firstName: 'kenan',
            lastName: 'hancer',
            primaryEmail: 'kenan.hancer@somoglobal.com',
            roleName: 'User',
            clientAccountId: '1',
            clientAccountName: 'User',
        };

        try {
            await createUser(createUserInput, defaultContext);

            throw new Error('Code never should come in this point');
        } catch (error: any) {
            expect(error.message.startsWith('Cognito Error:')).toBe(true);
        }
    });

    test('IamPersister Successful false', async () => {
        // const createUserIamRepositoryResult = { success: false, data: { userName: '' }, error: 'TEST' };

        mockedIamRepository.defaultInstance.createUser.mockResolvedValue({ success: false, data: { userName: '' } });
        mockedUserProfileRepostiroyV2.defaultInstance.createUser.mockResolvedValue(defaultCreateUserRepositoryResult);

        const createUserInput: CreateUserInput = {
            title: 'Mr',
            firstName: 'kenan',
            lastName: 'hancer',
            primaryEmail: 'kenan.hancer@somoglobal.com',
            roleName: 'User',
            clientAccountId: '1',
            clientAccountName: 'User',
        };

        try {
            await createUser(createUserInput, defaultContext);

            throw new Error('Code never should come in this point');
        } catch (error: any) {
            expect(error.message.startsWith('Cognito Error:')).toBe(true);
        }
    });

});


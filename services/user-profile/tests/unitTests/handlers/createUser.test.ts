import { createUser } from '../../../src/handlers/createUser/createUser';
import { UserProfileRepositoryV2, IamRepository, ClientAccountRepository } from '../../../src/repositories';
import { mocked } from 'ts-jest/utils';
import { createContext, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CreateUserInput } from '../../../src/domain';
import { User, ClientAccountOutput, } from '@dodsgroup/dods-model';

const defaultContext = createContext();

const defaultCreateUserRepositoryResult = { id: 1, title: 'Mr', firstName: 'kenan', lastName: 'hancer', primaryEmail: 'kenan.hancer@somoglobal.com' } as User;


jest.mock('../../../src/repositories/UserProfileRepositoryV2');
jest.mock('../../../src/repositories/IamRepository');
jest.mock('../../../src/repositories/ClientAccountRepository');

const mockedUserProfileRepostiroyV2 = mocked(UserProfileRepositoryV2, true);
const mockedIamRepository = mocked(IamRepository, true);
const mockedClientAccountRepository = mocked(ClientAccountRepository, true);



const FUNCTION_NAME = createUser.name;

afterEach(() => {
    mockedClientAccountRepository.mockClear();
    mockedIamRepository.mockClear();
    mockedUserProfileRepostiroyV2.mockReset();
});

describe(`${FUNCTION_NAME} handler`, () => {
    test('Valid input', async () => {

        const findOneInClientAccountRepostiroyResult = { name: 'test client account' } as ClientAccountOutput;
        const createUserInIamRepositoryResult = { success: true, data: { userName: 'test' } };

        mockedClientAccountRepository.defaultInstance.findOne.mockResolvedValue(findOneInClientAccountRepostiroyResult);
        mockedIamRepository.defaultInstance.createUser.mockResolvedValue(createUserInIamRepositoryResult);
        mockedUserProfileRepostiroyV2.defaultInstance.createUser.mockResolvedValue(defaultCreateUserRepositoryResult);

        const createUserInput: CreateUserInput = {
            title: 'Mr',
            firstName: 'kenan',
            lastName: 'hancer',
            primaryEmail: 'kenan.hancer@somoglobal.com',
            roleId: '0e6c0561-8ff1-4f74-93bc-77444b156c6f',
            clientAccountId: '1',
        };

        const createUserResult = new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'User was created succesfully',
            User: {
                displayName: defaultCreateUserRepositoryResult.fullName,
                userName: defaultCreateUserRepositoryResult.primaryEmail,
                emailAddress: defaultCreateUserRepositoryResult.primaryEmail,
                userId: createUserInIamRepositoryResult.data.userName,
                roleId: '0e6c0561-8ff1-4f74-93bc-77444b156c6f',
                clientAccount: {
                    id: createUserInput.clientAccountId,
                    name: findOneInClientAccountRepostiroyResult.name
                }
            }
        });

        const response = await createUser(createUserInput, defaultContext);

        expect(response).toEqual(createUserResult);
    });

    test('Invalid input', async () => {
        const findOneInClientAccountRepostiroyResult = { name: 'test client account' } as ClientAccountOutput;

        mockedClientAccountRepository.defaultInstance.findOne.mockResolvedValue(findOneInClientAccountRepostiroyResult);
        mockedIamRepository.defaultInstance.createUser.mockImplementation(() => { throw { response: { data: { error: 'TEST' } } } });
        mockedUserProfileRepostiroyV2.defaultInstance.createUser.mockResolvedValue(defaultCreateUserRepositoryResult);

        const createUserInput: CreateUserInput = {
            title: 'Mr',
            firstName: 'kenan',
            lastName: 'hancer',
            primaryEmail: 'kenan.hancer@somoglobal.com',
            roleId: '0e6c0561-8ff1-4f74-93bc-77444b156c6f',
            clientAccountId: '1',
        };

        try {
            await createUser(createUserInput, defaultContext);

            throw new Error('Code never should come in this point');
        } catch (error: any) {
            expect(error.message.startsWith('Cognito Error:')).toBe(true);
        }
    });

    test('IamPersister Successful false', async () => {
        const findOneInClientAccountRepostiroyResult = { name: 'test client account' } as ClientAccountOutput;
        const createUserInIamRepositoryResult = { success: false, data: { userName: '' } };

        mockedClientAccountRepository.defaultInstance.findOne.mockResolvedValue(findOneInClientAccountRepostiroyResult);
        mockedIamRepository.defaultInstance.createUser.mockResolvedValue(createUserInIamRepositoryResult);
        mockedUserProfileRepostiroyV2.defaultInstance.createUser.mockResolvedValue(defaultCreateUserRepositoryResult);

        const createUserInput: CreateUserInput = {
            title: 'Mr',
            firstName: 'kenan',
            lastName: 'hancer',
            primaryEmail: 'kenan.hancer@somoglobal.com',
            roleId: '0e6c0561-8ff1-4f74-93bc-77444b156c6f',
            clientAccountId: '1',
        };

        try {
            await createUser(createUserInput, defaultContext);

            throw new Error('Code never should come in this point');
        } catch (error: any) {
            expect(error.message.startsWith('Cognito Error:')).toBe(true);
        }
    });

});


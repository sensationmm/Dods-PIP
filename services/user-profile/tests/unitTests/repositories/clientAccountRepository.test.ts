import { ClientAccount, ClientAccountInput } from '@dodsgroup/dods-model';
import { mocked } from 'ts-jest/utils';
import { ClientAccountRepository } from '../../../src/repositories/ClientAccountRepository';


jest.mock('@dodsgroup/dods-model');

const mockedClientAccount = mocked(ClientAccount);

const CLASS_NAME = ClientAccountRepository.name;
const FIND_ONE_FUNCTION_NAME = ClientAccountRepository.defaultInstance.findOne.name;

const defaultFindOneClientAccountRepositoryResponse = {} as ClientAccount;

afterEach(() => {
    mockedClientAccount.mockClear();
});

describe(`${CLASS_NAME} tests`, () => {
    it(`${FIND_ONE_FUNCTION_NAME} Valid Input`, async () => {

        mockedClientAccount.findOne.mockResolvedValue({} as ClientAccount);

        const parameters: Partial<ClientAccountInput> = { uuid: '0e6c0561-8ff1-4f74-93bc-77444b156c6f' };

        const response = await ClientAccountRepository.defaultInstance.findOne(parameters);

        expect(response).toEqual(defaultFindOneClientAccountRepositoryResponse);
    });

    it(`${FIND_ONE_FUNCTION_NAME} Invalid Input`, async () => {
        mockedClientAccount.findOne.mockResolvedValue(undefined as any);

        const parameters: Partial<ClientAccountInput> = { uuid: '0e6c0561-8ff1-4f74-93bc-77444b156c6f' };

        try {
            await ClientAccountRepository.defaultInstance.findOne(parameters);
            
            throw new Error('Code never should come in this point');
        } catch (error: any) {
            expect(error.message).toEqual(`Error: ClientAccount with ${parameters} does not exist`);
        }
    });
});

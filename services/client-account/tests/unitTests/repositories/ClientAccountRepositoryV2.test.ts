import { ClientAccountRepositoryV2 } from '../../../src/repositories/ClientAccountRepositoryV2'
import { ClientAccount } from '@dodsgroup/dods-model';
import { mocked } from 'ts-jest/utils';

jest.mock('@dodsgroup/dods-model');

const mockedClientAccount = mocked(ClientAccount, true);

const defaultFindOneInClientAccount = {
    id: 1,
    uuid: '22dd3ef9-6871-4773-8298-f190cc8d5c85',
    name: 'Company One',
    contactName: 'Marty MacFly',
    contactEmailAddress: 'marti@example.com',
    contactTelephoneNumber: '+122233443',
    contractRollover: false,
} as ClientAccount;


const CLASS_NAME = ClientAccountRepositoryV2.name;
const FIND_ONE_FUNCTION_NAME = ClientAccountRepositoryV2.defaultInstance.findOne.name;

afterEach(() => {
    mockedClientAccount.findOne.mockClear();
});

describe(`${CLASS_NAME} handler`, () => {
    test(`${FIND_ONE_FUNCTION_NAME} Valid case `, async () => {
        mockedClientAccount.findOne.mockResolvedValue(defaultFindOneInClientAccount);

        const response = await ClientAccountRepositoryV2.defaultInstance.findOne({ uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3', });

        expect(response).toEqual(defaultFindOneInClientAccount);
    });

    test(`${FIND_ONE_FUNCTION_NAME} Invalid case `, async () => {
        mockedClientAccount.findOne.mockResolvedValue(undefined as any);

        try {
            await ClientAccountRepositoryV2.defaultInstance.findOne({ uuid: '0e6c0561-8ff1-4f74-93bc-77444b156c6f' });

            throw new Error('Code never should come in this point');
        } catch (error: any) {
            expect(error.message).toEqual('Error: clientAccount not found');
        }
    });
});
import { ClientAccountRepositoryV2 } from '../../../src/repositories/ClientAccountRepositoryV2'
import { ClientAccount, ClientAccountInput } from '@dodsgroup/dods-model';
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
const INCREMENT_FUNCTION_NAME = ClientAccountRepositoryV2.defaultInstance.incrementSubscriptionSeats.name;

afterEach(() => {
    mockedClientAccount.findOne.mockClear();
    mockedClientAccount.increment.mockClear();
});

describe(`${CLASS_NAME} handler`, () => {
    test(`${FIND_ONE_FUNCTION_NAME} Valid case `, async () => {
        mockedClientAccount.findOne.mockResolvedValue(defaultFindOneInClientAccount);

        const parameters: Partial<ClientAccountInput> = { uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3' };

        const response = await ClientAccountRepositoryV2.defaultInstance.findOne(parameters);

        expect(response).toEqual(defaultFindOneInClientAccount);
    });

    test(`${FIND_ONE_FUNCTION_NAME} Invalid case `, async () => {
        mockedClientAccount.findOne.mockResolvedValue(undefined as any);

        const parameters: Partial<ClientAccountInput> = { uuid: '0e6c0561-8ff1-4f74-93bc-77444b156c6f' };

        try {
            await ClientAccountRepositoryV2.defaultInstance.findOne(parameters);

            throw new Error('Code never should come in this point');
        } catch (error: any) {
            expect(error.message).toEqual(`Error: ClientAccount with ${JSON.stringify(parameters)} does not exist`);
        }
    });

    test(`${INCREMENT_FUNCTION_NAME} Valid case `, async () => {
        mockedClientAccount.increment.mockResolvedValue(defaultFindOneInClientAccount);

        const parameters: Partial<ClientAccountInput> = { uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3' };

        await ClientAccountRepositoryV2.defaultInstance.incrementSubscriptionSeats(parameters);

        expect(mockedClientAccount.increment).toHaveBeenCalledTimes(1);
    });
});
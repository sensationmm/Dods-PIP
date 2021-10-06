import { ClientAccountError, ClientAccountRepository } from '../../../src/repositories';
import { ClientAccountParameters } from '../../../src/domain';
import { SubscriptionTypeModel } from '../../../src/db';

const SUCCESS_UPDATE_CLIENT_ACCOUNT = {
    uuid: '22dd3ef9-6871-4773-8298-f190cc8d5c85',
    name: 'Company One',
    notes: null,
    contact_name: 'Marty MacFly',
    contact_email_address: 'marti@example.com',
    contact_telephone_number: '+122233443',
    contract_start_date: '2021-01-01T01:01:01.001Z',
    contract_rollover: false,
    contract_end_date: '2022-02-01T01:01:01.001Z',
    subscription_seats: 32,
    consultant_hours: 13,
};

const SequelizeMock = require('sequelize-mock');

const UPDATE_FUNCTION = ClientAccountRepository.defaultInstance.updateClientAccount.name;
const GET_FUNCTION = ClientAccountRepository.defaultInstance.getClientAccount.name;
const CREATE_FUNCTION = ClientAccountRepository.defaultInstance.createClientAccount.name;
const GET_CLIENT_ACCOUNT_SUBS_SEATS = ClientAccountRepository.defaultInstance.getClientAccountSeats.name;
const GET_CLIENT_ACCOUNT_USERS = ClientAccountRepository.defaultInstance.getClientAccountUsers.name;

const dbMock = new SequelizeMock();

const ClientAccountMock = dbMock.define(
    'dods_client_accounts',
    {
        id: 1,
        uuid: '22dd3ef9-6871-4773-8298-f190cc8d5c85',
        name: 'Company One',
        notes: null,
        contactName: 'Marty MacFly',
        contactEmailAddress: 'marti@example.com',
        contactTelephoneNumber: '+122233443',
        contract_start_date: '2021-01-01T01:01:01.001Z',
        contract_rollover: false,
        contract_end_date: '2022-02-01T01:01:01.001Z',
    }
    //{ autoQueryFallback: false }
);

ClientAccountMock.$queryInterface.$useHandler(function (query: any, queryOptions: any) {
    if (query === 'findOne') {
        if (queryOptions[0].where.uuid === '22dd3ef9-6871-4773-8298-f190cc8d5c85') {
            return ClientAccountMock.build({
                id: 1,
                uuid: '22dd3ef9-6871-4773-8298-f190cc8d5c85',
                name: 'Company One',
                notes: null,
                contactName: 'Marty MacFly',
                contactEmailAddress: 'marti@example.com',
                contactTelephoneNumber: '+122233443',
            });
        } else if (queryOptions[0].where.uuid === 'f4ad407b-6a88-4438-9538-7ef15b61c7fa') {
            return ClientAccountMock.build({
                uuid: 'f4ad407b-6a88-4438-9538-7ef15b61c7fa',
                name: 'OtherNames',
                notes: null,
                contactName: 'Mike Fly',
                contactEmailAddress: 'mike@example.com',
                contactTelephoneNumber: '313222123',
                contractStartDate: new Date('2021-01-01T01:01:01.000Z'),
                contractRollover: false,
                contractEndDate: new Date('2022-02-01T01:01:01.000Z'),
                subscription: undefined,
            });
        } else if (queryOptions[0].where.uuid === '9dfa3e0c-c6bc-4d04-b660-eeceba3f458e') {
            return ClientAccountMock.build({
                id: 3,
                uuid: '9dfa3e0c-c6bc-4d04-b660-eeceba3f458e',
                name: 'Company Tree',
                notes: null,
                contactName: 'Marty MacFly',
                contactEmailAddress: 'marti@example.com',
                contactTelephoneNumber: '+122233443',
                subscriptionSeats: 27,
                UserProfileModels: {
                    user1: {},
                    user2: {},
                    user3: {},
                },
            });
        } else {
            return null;
        }
    }
});

const SubscriptionTypeMock = dbMock.define('dods_subscription_types', {
    id: 1,
    uuid: 'abc920c3-153a-4c0a-879b-9e5595a55b58',
    name: 'subs_1',
    location: 2,
    contentType: 2,
});

SubscriptionTypeMock.$queryInterface.$useHandler(function (query: any, queryOptions: any) {
    if (query === 'findOne') {
        if (
            queryOptions[0].where.uuid ===
            '4de05e7d-3394-4890-8347-a4db53b3691f'
        ) {
            return SubscriptionTypeModel.build({
                id: 1,
                uuid: '4de05e7d-3394-4890-8347-a4db53b3691f',
                name: 'subs_1',
                location: 2,
                contentType: 2,
            });
        } else {
            return null;
        }
    }
});

const UserProfileMock = dbMock.define('dods_users', {});

const testRepository = new ClientAccountRepository(ClientAccountMock, SubscriptionTypeMock, UserProfileMock);

afterEach(() => {
    ClientAccountMock.$clearQueue();
    SubscriptionTypeMock.$clearQueue();
});

describe(`${UPDATE_FUNCTION} handler`, () => {
    test(`${UPDATE_FUNCTION} Valid input Happy case `, async () => {
        const clientAccount = {
            clientAccountId: '22dd3ef9-6871-4773-8298-f190cc8d5c85',
            subscription: '4de05e7d-3394-4890-8347-a4db53b3691f',
            subscription_seats: 32,
            consultant_hours: 13,
            contract_start_date: '2021-01-01T01:01:01.001Z',
            contract_rollover: false,
            contract_end_date: '2022-02-01T01:01:01.001Z',
        };

        const response = await testRepository.updateClientAccount(clientAccount);

        expect(response).toEqual(SUCCESS_UPDATE_CLIENT_ACCOUNT);
    });

    test(`${UPDATE_FUNCTION} invalid client account case `, async () => {
        const clientAccount = {
            clientAccountId: 'edae80fd-12e6-4a8e-9e69-32775b3538b6',
            subscription: '4de05e7d-3394-4890-8347-a4db53b3691f',
            subscription_seats: 32,
            consultant_hours: 13,
            contract_start_date: '2021-01-01T01:01:01.001Z',
            contract_rollover: false,
            contract_end_date: '2021-02-01T01:01:01.001Z',
        };

        const expectedError = new Error('Error: clientAccount not found');
        try {
            await testRepository.updateClientAccount(clientAccount);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });

    test(`${UPDATE_FUNCTION} invalid subscription account case `, async () => {
        const clientAccount = {
            clientAccountId: '22dd3ef9-6871-4773-8298-f190cc8d5c85',
            subscription: '4de05e7d-3394-4890-8347-a4db53b3691f',
            subscription_seats: 32,
            consultant_hours: 13,
            contract_start_date: '2021-01-01T01:01:01.001Z',
            contract_rollover: false,
            contract_end_date: '2021-02-01T01:01:01.001Z',
        };

        const expectedError = new Error('Error: Wrong subscription uuid');

        try {
            await testRepository.updateClientAccount(clientAccount);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });

    test(`${UPDATE_FUNCTION} empty Client Account`, async () => {
        const clientAccount = {
            clientAccountId: '',
            subscription: '4de05e7d-3394-4890-8347-a4db53b3691f',
            subscription_seats: 32,
            consultant_hours: 13,
            contract_start_date: '2021-01-01T01:01:01.001Z',
            contract_rollover: false,
            contract_end_date: '2021-02-01T01:01:01.001Z',
        };

        const expectedError = new Error(
            'Error: clientAccountId cannot be empty'
        );

        try {
            await testRepository.updateClientAccount(clientAccount);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });
});

describe(`${GET_FUNCTION} handler`, () => {
    test(`${GET_FUNCTION} Valid input Happy case `, async () => {
        const clientAccountId = 'f4ad407b-6a88-4438-9538-7ef15b61c7fa';

        const expectedResponse = {
            uuid: 'f4ad407b-6a88-4438-9538-7ef15b61c7fa',
            name: 'OtherNames',
            notes: null,
            contact_name: 'Mike Fly',
            contact_email_address: 'mike@example.com',
            contact_telephone_number: '313222123',
            contract_start_date: '2021-01-01T01:01:01.000Z',
            contract_rollover: false,
            contract_end_date: '2022-02-01T01:01:01.000Z',
            subscription: undefined,
        };

        const response = await testRepository.getClientAccount(clientAccountId);

        expect(response).toEqual(expectedResponse);
    });

    test(`${GET_FUNCTION} invalid input not client account `, async () => {
        const clientAccountId = 'f4ad407b-6a88-4438-9538-7ef15b61c7fad';

        const expectedError = new Error('Error: clientAccount not found');

        try {
            await testRepository.getClientAccount(clientAccountId);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });

    test(`${GET_FUNCTION} empty Client Account`, async () => {
        const clientAccountId = '';

        const expectedError = new Error('Error: clientAccountId cannot be empty');

        try {
            await testRepository.getClientAccount(clientAccountId);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });
});

describe(`Client Account Error Class`, () => {
    test('ClientAccountError Class Test', () => {
        const errorObj = new ClientAccountError('ClientAccountError', 1);
        expect(errorObj.name).toBe('ClientAccountError');
        expect(errorObj.cause).toBe(1);
    });
});

describe(`${CREATE_FUNCTION} handler`, () => {
    test(`${CREATE_FUNCTION} empty Client Account`, async () => {
        const clientAccount = null;

        const expectedError = new Error('Error: clientAccount cannot be empty');

        try {
            await testRepository.createClientAccount(clientAccount);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });

    test(`${CREATE_FUNCTION} Valid input Happy case `, async () => {
        const clientAccount: ClientAccountParameters | any = {
            name: 'Juan account',
            notes: 'This is the account for Juan.',
            contact_name: 'Juan',
            contact_email_address: 'juan@xd.com',
            contact_telephone_number: '+573123456531',
            contract_start_date: '2021-09-20T03:51:15.226Z',
            contract_rollover: false,
        };

        const expectedResponse = {
            uuid: '22dd3ef9-6871-4773-8298-f190cc8d5c85',
            name: 'Juan account',
            notes: 'This is the account for Juan.',
            contact_name: 'Juan',
            contact_email_address: 'juan@xd.com',
            contact_telephone_number: '+573123456531',
            contract_start_date: '2021-09-20T03:51:15.226Z',
            contract_rollover: false,
            contract_end_date: undefined,
            subscription: undefined,
        };

        const response = await testRepository.createClientAccount(clientAccount);
        expect(response).toEqual(expectedResponse);
    });

    test(`${CREATE_FUNCTION} Invalid Input`, async () => {
        const clientAccount: ClientAccountParameters | any = {
            name: '',
            notes: 'This is the account for Juan.',
            contact_name: 'Juan',
            contact_email_address: 'juan@xd.com',
            contact_telephone_number: '+573123456531',
            contract_start_date: '2021-09-20T03:51:15.226Z',
            contract_rollover: false,
        };

        try {
            await testRepository.createClientAccount(clientAccount);
            //console.log(response);
        } catch (error) {
            expect(error).toEqual('Error: Bad request');
        }
    });
});

describe(`${GET_CLIENT_ACCOUNT_SUBS_SEATS} handler`, () => {
    test(`${GET_CLIENT_ACCOUNT_SUBS_SEATS} Valid input Happy case `, async () => {
        const clientAccountId = '9dfa3e0c-c6bc-4d04-b660-eeceba3f458e';

        const expectedAmountSeats = 27;

        const response = await testRepository.getClientAccountSeats(clientAccountId);

        expect(response).toEqual(expectedAmountSeats);
    });

    test(`${GET_CLIENT_ACCOUNT_SUBS_SEATS} Invalid client account `, async () => {
        const clientAccountId = '9dfa3e0c-c6bc-4d04-b660-eeceba3f458e';
        const expectedError = new Error('Error: clientAccount not found');

        try {
            await testRepository.getClientAccountSeats(clientAccountId);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });
    test(`${GET_CLIENT_ACCOUNT_USERS} empty client Account `, async () => {
        const clientAccountId = '';
        const expectedError = new Error('Error: clientAccountId cannot be empty');

        try {
            await testRepository.getClientAccountSeats(clientAccountId);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });
});

describe(`${GET_CLIENT_ACCOUNT_USERS} handler`, () => {
    test(`${GET_CLIENT_ACCOUNT_USERS} Valid input Happy case `, async () => {
        const clientAccountId = '9dfa3e0c-c6bc-4d04-b660-eeceba3f458e';

        const expectedAmountUsers = 3;

        const response = await testRepository.getClientAccountUsers(clientAccountId);
        expect(response).toEqual(expectedAmountUsers);
    });

    test(`${GET_CLIENT_ACCOUNT_USERS} Invalid client account  `, async () => {
        const clientAccountId = '9dfa3e0c-c6bc-4d04-b660-eeceba3f458e';

        const expectedError = new Error('Error: clientAccount not found');

        try {
            await testRepository.getClientAccountUsers(clientAccountId);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });

    test(`${GET_CLIENT_ACCOUNT_USERS} empty client Account `, async () => {
        const clientAccountId = '';

        const expectedError = new Error('Error: clientAccountId cannot be empty');

        try {
            await testRepository.getClientAccountUsers(clientAccountId);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });
});

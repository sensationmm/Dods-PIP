import {
    ClientAccountError,
    ClientAccountRepository,
} from '../../../src/repositories';

import { SearchClientAccountParameters } from '../../../src/domain';

const SequelizeMock = require('sequelize-mock');

const SUCCESS_UPDATE_CLIENT_ACCOUNT = {
    uuid: '22dd3ef9-6871-4773-8298-f190cc8d5c85',
    name: 'Company One',
    notes: '',
    contactName: 'Marty MacFly',
    contactEmailAddress: 'marti@example.com',
    contactTelephoneNumber: '+122233443',
    contractStartDate: new Date('2021-01-01T01:01:01.001Z'),
    contractRollover: false,
    contractEndDate: new Date('2022-02-01T01:01:01.001Z'),
    subscriptionSeats: 32,
    consultantHours: 13,
    isCompleted: true,
    lastStepCompleted: 1,
    subscription: {
        uuid: '4de05e7d-3394-4890-8347-a4db53b3691f',
        name: 'subs_1',
        location: 2,
        contentType: 2,
    },
};

const UPDATE_FUNCTION =
    ClientAccountRepository.defaultInstance.updateClientAccount.name;
const GET_FUNCTION =
    ClientAccountRepository.defaultInstance.getClientAccount.name;
const CREATE_FUNCTION =
    ClientAccountRepository.defaultInstance.createClientAccount.name;
const GET_CLIENT_ACCOUNT_SUBS_SEATS =
    ClientAccountRepository.defaultInstance.getClientAccountSeats.name;
const GET_CLIENT_ACCOUNT_USERS =
    ClientAccountRepository.defaultInstance.getClientAccountOccupiedSeats.name;
const UPDATE_CLIENT_ACCOUNT_HEADER =
    ClientAccountRepository.defaultInstance.updateClientAccountHeader.name;
const UPDATE_COMPLETION = ClientAccountRepository.defaultInstance.UpdateCompletion.name;

const SEARCH_FUNCTION = ClientAccountRepository.defaultInstance.searchClientAccount.name;

const dbMock = new SequelizeMock();

const ClientAccountMock = dbMock.define(
    'dods_client_accounts',
    {
        id: 1,
        uuid: '22dd3ef9-6871-4773-8298-f190cc8d5c85',
        name: 'Company One',
        contactName: 'Marty MacFly',
        contactEmailAddress: 'marti@example.com',
        contactTelephoneNumber: '+122233443',
        contractStartDate: '2021-01-01T01:01:01.001Z',
        contractRollover: false,
        contractEndDate: '2022-02-01T01:01:01.001Z',
    },
    {
        instanceMethods: {
            setSubscriptionType: function () {
                return true;
            },
        },
    }
);

ClientAccountMock.$queryInterface.$useHandler(function (query: any, queryOptions: any) {
    if (query === 'findOne') {
        if (queryOptions[0].where.uuid === '22dd3ef9-6871-4773-8298-f190cc8d5c85') {
            return ClientAccountMock.build({
                id: 1,
                uuid: '22dd3ef9-6871-4773-8298-f190cc8d5c85',
                name: 'Company One',
                notes: '',
                contactName: 'Marty MacFly',
                contactEmailAddress: 'marti@example.com',
                contactTelephoneNumber: '+122233443',
            });
        } else if (queryOptions[0].where.uuid === 'f4ad407b-6a88-4438-9538-7ef15b61c7fa') {
            return ClientAccountMock.build({
                uuid: 'f4ad407b-6a88-4438-9538-7ef15b61c7fa',
                name: 'OtherNames',
                notes: '',
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
                notes: '',
                contactName: 'Marty MacFly',
                contactEmailAddress: 'marti@example.com',
                contactTelephoneNumber: '+122233443',
                subscriptionSeats: 27,
                team: [
                    {
                        uuid: '89139c46-711d-42cf-affd-b865dd9191eb',
                        fullName: 'Latest Tester',
                        ClientAccountTeamModel: {
                            teamMemberType: 1,
                        },
                    },
                    {
                        uuid: '30360fcd-91be-46f3-8177-e2123f756838',
                        fullName: 'Employee Example',
                        ClientAccountTeamModel: {
                            teamMemberType: 3,
                        },
                        isActive: true,
                    },
                ],
            });
        }

        if (queryOptions[0].where.uuid === 'b0605d89-6200-4861-a9d5-258ccb33cbe3') {
            return ClientAccountMock.build({
                id: 1,
                uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3',
                name: 'Company One',
                notes: '',
                contactName: 'Marty MacFly',
                contactEmailAddress: 'marti@example.com',
                contactTelephoneNumber: '+122233443',
                subscriptionSeats: 32,
                consultantHours: 13,
                contractStartDate: new Date('2021-01-01T01:01:01.001Z'),
                contractRollover: false,
                contractEndDate: new Date('2022-02-01T01:01:01.001Z'),
                isCompleted: true,
                lastStepCompleted: 1,
                subscriptionType: {
                    uuid: '4de05e7d-3394-4890-8347-a4db53b3691f',
                    name: 'subs_1',
                    location: 2,
                    contentType: 2,
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
        if (queryOptions[0].where.uuid === '4de05e7d-3394-4890-8347-a4db53b3691f') {
            return SubscriptionTypeMock.build({
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

const UserProfileModelMock = dbMock.define('dods_client_accounts', {
    id: 1,
    uuid: '0e6c0561-8ff1-4f74-93bc-77444b156c6f',
    title: 'Sir.',
    firstName: 'Other',
    lastName: 'Tester',
    primaryEmail: 'dodstestlocal1@mailinator.com',
    secondaryEmail: 'dodstestlocal2@mailinator.com',
    telephoneNumber1: '+573214858576',
    telephoneNumber2: '+573214858577',
    roleId: 1,
});

const ClientAccountTeamModelMock = dbMock.define('dods_client_account_teams', {
    clientAccountId: 1,
    userId: 1,
    teamMemberType: 1,
});

ClientAccountMock.belongsTo(SubscriptionTypeMock, {
    foreignKey: 'subscription',
    as: 'subscriptionType',
});

const testRepository = new ClientAccountRepository(
    ClientAccountMock,
    SubscriptionTypeMock,
    UserProfileModelMock,
    ClientAccountTeamModelMock
);

afterEach(() => {
    ClientAccountMock.$clearQueue();
    SubscriptionTypeMock.$clearQueue();
});

describe(`${UPDATE_FUNCTION} handler`, () => {
    test(`${UPDATE_FUNCTION} Valid input Happy case `, async () => {
        const clientAccount = {
            clientAccountId: 'b0605d89-6200-4861-a9d5-258ccb33cbe3',
            subscription: '4de05e7d-3394-4890-8347-a4db53b3691f',
            subscriptionSeats: 32,
            consultantHours: 13,
            contractStartDate: '2021-01-01T01:01:01.001Z',
            contractRollover: false,
            contractEndDate: '2022-02-01T01:01:01.001Z',
            isUK: true,
            isEU: false,
        };

        const response = await testRepository.updateClientAccount(clientAccount);

        expect(response).toEqual({
            ...SUCCESS_UPDATE_CLIENT_ACCOUNT,
            uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3',
        });
    });

    test(`${UPDATE_FUNCTION} invalid client account case `, async () => {
        const clientAccount = {
            clientAccountId: 'edae80fd-12e6-4a8e-9e69-32775b3538b6',
            subscription: '4de05e7d-3394-4890-8347-a4db53b3691f',
            subscriptionSeats: 32,
            consultantHours: 13,
            contractStartDate: '2021-01-01T01:01:01.001Z',
            contractRollover: false,
            contractEndDate: '2021-02-01T01:01:01.001Z',
            isUK: true,
            isEU: false,
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
            subscription: '4de05e7d-3394-4890-8347-a4db53b3691',
            subscriptionSeats: 32,
            consultantHours: 13,
            contractStartDate: '2021-01-01T01:01:01.001Z',
            contractRollover: false,
            contractEndDate: '2021-02-01T01:01:01.001Z',
            isUK: true,
            isEU: false,
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
            subscriptionSeats: 32,
            consultantHours: 13,
            contractStartDate: '2021-01-01T01:01:01.001Z',
            contractRollover: false,
            contractEndDate: '2021-02-01T01:01:01.001Z',
            isUK: true,
            isEU: false,
        };

        const expectedError = new Error('Error: clientAccountId cannot be empty');

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
            notes: '',
            contactName: 'Mike Fly',
            contactEmailAddress: 'mike@example.com',
            contactTelephoneNumber: '313222123',
            contractStartDate: new Date('2021-01-01T01:01:01.000Z'),
            contractRollover: false,
            contractEndDate: new Date('2022-02-01T01:01:01.000Z'),
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
        const clientAccount = {
            name: 'Juan account',
            notes: 'This is the account for Juan.',
            contactName: 'Juan',
            contactEmailAddress: 'juan@xd.com',
            contactTelephoneNumber: '+573123456531',
        };

        const expectedResponse = {
            uuid: '22dd3ef9-6871-4773-8298-f190cc8d5c85',
            name: 'Juan account',
            notes: 'This is the account for Juan.',
            contactName: 'Juan',
            contactEmailAddress: 'juan@xd.com',
            contactTelephoneNumber: '+573123456531',

            consultantHours: undefined,

            contractEndDate: '2022-02-01T01:01:01.001Z',
            contractRollover: false,
            contractStartDate: '2021-01-01T01:01:01.001Z',

            isCompleted: undefined,
            lastStepCompleted: undefined,
            isEu: undefined,
            isUk: undefined,

            subscription: undefined,
            subscriptionSeats: undefined,
        };

        const response = await testRepository.createClientAccount({
            clientAccount,
        });
        expect(response).toEqual(expectedResponse);
    });

    test(`${CREATE_FUNCTION} Invalid Input`, async () => {
        const clientAccount = {
            name: '',
            notes: 'This is the account for Juan.',
            contactName: 'Juan',
            contactEmailAddress: 'juan@xd.com',
            contactTelephoneNumber: '+573123456531',
        };

        try {
            await testRepository.createClientAccount({ clientAccount });
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
        const clientAccountId = '9dfa3e0c-c6bc-4d04-b660-eeceba3f458';
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

        const expectedAmountUsers = 1;

        const response = await testRepository.getClientAccountOccupiedSeats(clientAccountId);
        expect(response).toEqual(expectedAmountUsers);
    });

    test(`${GET_CLIENT_ACCOUNT_USERS} Invalid client account  `, async () => {
        const clientAccountId = '9dfa3e0c-c6bc-4d04-b660-eeceba3f458e';

        const expectedError = new Error('Error: clientAccount not found');

        try {
            await testRepository.getClientAccountOccupiedSeats(clientAccountId);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });

    test(`${GET_CLIENT_ACCOUNT_USERS} empty client Account `, async () => {
        const clientAccountId = '';

        const expectedError = new Error('Error: clientAccountUuid cannot be empty');

        try {
            await testRepository.getClientAccountOccupiedSeats(clientAccountId);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });
});

describe(`${UPDATE_CLIENT_ACCOUNT_HEADER} handler`, () => {
    test(`${UPDATE_CLIENT_ACCOUNT_HEADER} Valid input Happy case `, async () => {
        const clientAccount = {
            clientAccountId: 'b0605d89-6200-4861-a9d5-258ccb33cbe3',
            name: 'Company_4',
            notes: 'this is the compnay 1 ',
            contactName: 'George Beckamn',
            contactEmailAddress: 'george@gmail.com',
            contactTelephoneNumber: '',
        };

        const response = await testRepository.updateClientAccountHeader(
            clientAccount
        );

        expect(response).toEqual({
            ...SUCCESS_UPDATE_CLIENT_ACCOUNT,
            uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3',
        });
    });

    test(`${UPDATE_CLIENT_ACCOUNT_HEADER} invalid client account case `, async () => {
        const clientAccount = {
            clientAccountId: 'edae80fd-12e6-4a8e-9e69-32775b3538b6',
            name: 'Company_4',
            notes: 'this is the compnay 1 ',
            contactName: 'George Beckamn',
            contactEmailAddress: 'george@gmail.com',
            contactTelephoneNumber: '',
        };

        const expectedError = new Error('Error: clientAccount not found');
        try {
            await testRepository.updateClientAccountHeader(clientAccount);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });

    test(`${UPDATE_CLIENT_ACCOUNT_HEADER} empty Client Account`, async () => {
        const clientAccount = {
            clientAccountId: '',
            name: 'Company_4',
            notes: 'this is the compnay 1 ',
            contactName: 'George Beckamn',
            contactEmailAddress: 'george@gmail.com',
            contactTelephoneNumber: '',
        };

        const expectedError = new Error(
            'Error: clientAccountId cannot be empty'
        );

        try {
            await testRepository.updateClientAccountHeader(clientAccount);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });
});

describe(`${UPDATE_COMPLETION} handler`, () => {
    test(`${UPDATE_COMPLETION} Valid input Happy case `, async () => {
        const clientAccountId = 'b0605d89-6200-4861-a9d5-258ccb33cbe3';
        const lastStepCompleted = 2;
        const isCompleted = false;

        const response = await testRepository.UpdateCompletion(
            clientAccountId,
            isCompleted,
            lastStepCompleted
        );

        expect(response).toEqual(true);
    });

    test(`${UPDATE_COMPLETION} empty client id `, async () => {
        const clientAccountId = 'b0605d89-6200-4861-a9d5-258ccb33cbe3';
        const lastStepCompleted = 2;
        const isCompleted = false;

        const expectedError = new Error(
            'Error: clientAccountId cannot be empty'
        );

        try {
            await testRepository.UpdateCompletion(
                clientAccountId,
                isCompleted,
                lastStepCompleted
            );
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });
});

describe(`Check same name client `, () => {
    test(`Name is equal`, async () => {
        const clientAccountId = 'b0605d89-6200-4861-a9d5-258ccb33cbe3';
        const name = 'Company One';

        const response = await testRepository.checkSameName(
            name,
            clientAccountId
        );

        expect(response).toEqual(true);
    });

    test(`Name is different`, async () => {
        const clientAccountId = 'b0605d89-6200-4861-a9d5-258ccb33cbe3';
        const name = 'Wrong Name';

        const response = await testRepository.checkSameName(
            name,
            clientAccountId
        );

        expect(response).toEqual(false);
    });
});

describe(`Delete Client Account Team Members `, () => {
    test(`Valid delete`, async () => {
        const clientAccountId = 'b0605d89-6200-4861-a9d5-258ccb33cbe3';

        const response = await testRepository.deleteClientAccountTeamMembers(
            clientAccountId
        );

        expect(response).toEqual(true);
    });

    test(`Delete invalid input not client account `, async () => {
        const clientAccountId = 'f4ad407b-6a88-4438-9538-7ef15b61c7fad';

        const expectedError = new Error('Error: clientAccount not found');

        try {
            await testRepository.deleteClientAccountTeamMembers(
                clientAccountId
            );
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });
});

describe(`FindOne Model Client Account`, () => {
    test(`Valid FindOne Model `, async () => {
        const params = { uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3' };

        const expectedResponse = {
            id: 1,
            uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3',
            name: 'Company One',
            notes: '',
            contactName: 'Marty MacFly',
            contactEmailAddress: 'marti@example.com',
            contactTelephoneNumber: '+122233443',
            subscriptionSeats: 32,
            consultantHours: 13,
            contractStartDate: new Date('2021-01-01T01:01:01.001Z'),
            contractRollover: false,
            contractEndDate: new Date('2022-02-01T01:01:01.001Z'),
            isCompleted: true,
            lastStepCompleted: 1,
            subscriptionType: {
                uuid: '4de05e7d-3394-4890-8347-a4db53b3691f',
                name: 'subs_1',
                location: 2,
                contentType: 2,
            },
        };

        const response = await testRepository.findOne(params);

        expect(response).toEqual(expect.objectContaining(expectedResponse));
    });

    test(`FindOne invalid model `, async () => {
        const params = { uuid: 'f4ad407b-6a88-4438-9538-7ef15b61c7fad' };

        const expectedError = new Error('Error: clientAccount not found');

        try {
            await testRepository.findOne(params);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });
});

describe(`FindOne Model Client Account`, () => {
    test(`Valid FindOne Model `, async () => {
        const params = { uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3' };

        const expectedResponse = {
            id: 1,
            uuid: 'b0605d89-6200-4861-a9d5-258ccb33cbe3',
            name: 'Company One',
            notes: '',
            contactName: 'Marty MacFly',
            contactEmailAddress: 'marti@example.com',
            contactTelephoneNumber: '+122233443',
            subscriptionSeats: 32,
            consultantHours: 13,
            contractStartDate: new Date('2021-01-01T01:01:01.001Z'),
            contractRollover: false,
            contractEndDate: new Date('2022-02-01T01:01:01.001Z'),
            isCompleted: true,
            lastStepCompleted: 1,
            subscriptionType: {
                uuid: '4de05e7d-3394-4890-8347-a4db53b3691f',
                name: 'subs_1',
                location: 2,
                contentType: 2,
            },
        };

        const response = await testRepository.findOne(params);

        expect(response).toEqual(expect.objectContaining(expectedResponse));
    });

    test(`FindOne invalid model `, async () => {
        const params = { uuid: 'f4ad407b-6a88-4438-9538-7ef15b61c7fad' };

        const expectedError = new Error('Error: clientAccount not found');

        try {
            await testRepository.findOne(params);
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    });
});

describe(`${SEARCH_FUNCTION} handler`, () => {
    test(`${SEARCH_FUNCTION} Valid Search ClientAccounts `, async () => {
        const params: SearchClientAccountParameters = {
            limit: '10',
            offset: '0',
            isCompleted: 'false',
            locations: 'uk',
        };
        const expectedResponse = {
            clientAccountsData: [
                {
                    isCompleted: undefined,
                    isEU: false,
                    isUK: false,
                    lastStepCompleted: undefined,
                    location: undefined,
                    name: 'Company One',
                    notes: undefined,
                    projects: 0,
                    subscription: undefined,
                    team: undefined,
                    uuid: '22dd3ef9-6871-4773-8298-f190cc8d5c85',
                },
            ],
            totalRecordsModels: 1,
        };

        const response = await testRepository.searchClientAccount(params);

        expect(response).toEqual(expectedResponse);
    });

    test(`${SEARCH_FUNCTION} Valid Search different parameters `, async () => {
        const params: SearchClientAccountParameters = {
            limit: '10',
            offset: '0',
            isCompleted: 'true',
            locations: 'eu',
        };
        const expectedResponse = {
            clientAccountsData: [
                {
                    isCompleted: undefined,
                    isEU: false,
                    isUK: false,
                    lastStepCompleted: undefined,
                    location: undefined,
                    name: 'Company One',
                    notes: undefined,
                    projects: 0,
                    subscription: undefined,
                    team: undefined,
                    uuid: '22dd3ef9-6871-4773-8298-f190cc8d5c85',
                },
            ],
            totalRecordsModels: 1,
        };

        const response = await testRepository.searchClientAccount(params);

        expect(response).toEqual(expectedResponse);
    });
});

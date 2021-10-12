import { UserProfileError, UserProfileRepository } from '../../../src/repositories';

const SequelizeMock = require('sequelize-mock');

const SUCCESS_PROFILE_RESPONSE = {
    id: '0e6c0561-8ff1-4f74-93bc-77444b156c6f',
    title: 'Sir.',
    first_name: 'Other',
    last_name: 'Tester',
    primary_email_address: 'dodstestlocal1@mailinator.com',
    secondary_email_address: 'dodstestlocal2@mailinator.com',
    telephone_number_1: '+573214858576',
    telephone_number_2: '+573214858577',
    role: {
        id: '24e7ca86-1788-4b6e-b153-9c963dc928cb',
        title: 'Regular User',
        dods_role: false,
    },
};

const SUCCESS_PROFILE_REQUEST = {
    title: 'Sir.',
    first_name: 'Other',
    last_name: 'Tester',
    primary_email_address: 'dodstestlocal1@mailinator.com',
    secondary_email_address: 'dodstestlocal2@mailinator.com',
    telephone_number_1: '+573214858576',
    telephone_number_2: '+573214858577',
    role_id: '24e7ca86-1788-4b6e-b153-9c963dc928cb',
};

const CREATE_FUNCTION = UserProfileRepository.defaultInstance.createUserProfile.name;

const dbMock = new SequelizeMock();

const UserProfileModelMock = dbMock.define('dods_client_accounts', {
    id: 1,
    uuid: '0e6c0561-8ff1-4f74-93bc-77444b156c6f',
    title: 'Sir.',
    firstName: 'Other',
    lastName: 'Tester',
    primaryEmailAddress: 'dodstestlocal1@mailinator.com',
    secondaryEmailAddress: 'dodstestlocal2@mailinator.com',
    telephoneNumber1: '+573214858576',
    telephoneNumber2: '+573214858577',
    role_id: 1,
});

const RoleTypeMock = dbMock.define('dods_roles', {
    id: 1,
    uuid: '24e7ca86-1788-4b6e-b153-9c963dc928cb',
    title: 'Regular User',
    dodsRole: false,
});

UserProfileModelMock.belongsTo(RoleTypeMock, {
    foreignKey: 'role_id',
    as: 'role',
});

RoleTypeMock.$queryInterface.$useHandler((query: any, queryOptions: any) => {
    if (query === 'findOne') {
        if (queryOptions[0].where.uuid === '24e7ca86-1788-4b6e-b153-9c963dc928cb') {
            return RoleTypeMock.build({
                id: 1,
                uuid: '24e7ca86-1788-4b6e-b153-9c963dc928cb',
                title: 'Regular User',
                dodsRole: false,
            });
        } else {
            return null;
        }
    }
});

const testRepository = new UserProfileRepository(RoleTypeMock, UserProfileModelMock);

afterEach(() => {
    UserProfileModelMock.$clearQueue();
    RoleTypeMock.$clearQueue();
});

describe(`User Profile Error Class`, () => {
    test('UserProfileError Class Test', () => {
        const errorObj = new UserProfileError('UserProfileError', 1);
        expect(errorObj.name).toBe('UserProfileError');
        expect(errorObj.cause).toBe(1);
    });
});

describe(`${CREATE_FUNCTION} handler`, () => {
    test(`${CREATE_FUNCTION} Valid input Happy case `, async () => {
        const response = await testRepository.createUserProfile(SUCCESS_PROFILE_REQUEST);
        expect(response).toEqual(SUCCESS_PROFILE_RESPONSE);
    });

    test(`${CREATE_FUNCTION} bad role id`, async () => {
        const request = {
            ...SUCCESS_PROFILE_REQUEST,
            role_id: 'BAD_ROLE',
        };

        try {
            await testRepository.createUserProfile(request);
        } catch (error) {
            expect(error instanceof UserProfileError).toBe(true);
        }
    });
});

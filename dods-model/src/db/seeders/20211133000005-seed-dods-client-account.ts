import { Op, QueryInterface } from 'sequelize';

const seedData = [
    {
        uuid: 'cd44bad6-8eeb-4870-abb8-72d297ea7a3e',
        name: 'Company1',
        contact_name: 'Frank Smith',
        contact_email_address: 'Frank@xd.com',
        contact_telephone_number: '+1786225522',
        subscription_seats: 0,

        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        uuid: '6c0e0f58-aff8-4d0d-9a20-53215aee61cc',
        name: 'Company2',
        contact_name: 'Mark Smith',
        contact_email_address: 'mark@xd.com',
        contact_telephone_number: '+1786225522',
        subscription_seats: 0,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        uuid: 'a3ab02d6-3fd3-4a20-a284-455af84510d2',
        name: 'Company3',
        contact_name: 'Julie Smith',
        contact_email_address: 'julie@xd.com',
        contact_telephone_number: '+1786225522',
        subscription_seats: 0,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        uuid: 'a170742a-f84d-40e9-9176-8fd6568149f7',
        name: 'DODS GROUP',
        contact_name: 'person dods',
        contact_email_address: 'people@dods.com',
        contact_telephone_number: '+1',
        subscription_seats: 100,
        created_at: new Date(),
        updated_at: new Date(),
    },
];

const uuidArray = seedData.map(item => item.uuid);

export = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.bulkInsert('dods_client_accounts', seedData);
    },
    down: (queryInterface: QueryInterface) => {
        return queryInterface.bulkDelete('dods_client_accounts', { uuid: { [Op.or]: uuidArray, }, });
    },
};

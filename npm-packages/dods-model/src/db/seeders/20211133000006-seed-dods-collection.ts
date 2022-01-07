import { Op, QueryInterface } from 'sequelize';

const seedData = [
    {
        uuid: 'cd44bad6-8eeb-4870-abb8-72d297ea7a11',
        name: 'Collection1',
        client_account_id: 1,
        is_active: 1,
        created_by_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        uuid: 'cd44bad6-8eeb-4870-abb8-72d297ea7a12',
        name: 'Collection2',
        client_account_id: 1,
        is_active: 1,
        created_by_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        uuid: 'cd44bad6-8eeb-4870-abb8-72d297ea7a13',
        name: 'Collection3',
        client_account_id: 2,
        is_active: 1,
        created_by_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        uuid: 'cd44bad6-8eeb-4870-abb8-72d297ea7a14',
        name: 'Collection4',
        client_account_id: 2,
        is_active: 0,
        created_by_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
    },
];

const uuidArray = seedData.map(item => item.uuid);

export = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.bulkInsert('dods_collections', seedData);
    },
    down: (queryInterface: QueryInterface) => {
        return queryInterface.bulkDelete('dods_collections', { uuid: { [Op.or]: uuidArray, }, });
    },
};

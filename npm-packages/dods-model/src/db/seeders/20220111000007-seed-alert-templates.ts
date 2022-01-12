import { Op, QueryInterface } from 'sequelize';

const seedData = [
    {
        id: 1,
        name: 'Full Text',
        is_active: 1,
        created_at: new Date(),

    },
    {
        id: 2,
        name: 'Snippet',
        is_active: 1,
        created_at: new Date(),
    }
];

const idArray = seedData.map(item => item.id);

export = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.bulkInsert('dods_collections_alert_templates', seedData);
    },
    down: (queryInterface: QueryInterface) => {
        return queryInterface.bulkDelete('dods_collections_alert_templates', { uuid: { [Op.or]: idArray, }, });
    },
};

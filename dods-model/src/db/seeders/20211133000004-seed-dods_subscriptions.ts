import { Op, QueryInterface } from 'sequelize';

export = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.bulkInsert('dods_subscription_types', [
            {
                uuid: '13c351ed-d92a-41a9-b412-55dc0f0d28d3',
                name: 'Bronze',
                location: 0,
                content_type: 0,
                created_at: new Date(),
                updated_at: new Date(),
            },

            {
                uuid: '85fc806f-d0fb-465a-a32a-e79730c59210',
                name: 'Silver',
                location: 0,
                content_type: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },

            {
                uuid: '2cb2e9fe-f17f-467a-aeba-8b3b6dd69aac',
                name: 'Gold',
                location: 0,
                content_type: 2,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },
    down: (queryInterface: QueryInterface) => {
        return queryInterface.bulkDelete('dods_subscription_types', {
            uuid: {
                [Op.or]: [
                    '13c351ed-d92a-41a9-b412-55dc0f0d28d3',
                    '85fc806f-d0fb-465a-a32a-e79730c59210',
                    '2cb2e9fe-f17f-467a-aeba-8b3b6dd69aac',
                ],
            },
        });
    },
};

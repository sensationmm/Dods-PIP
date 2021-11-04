import { QueryInterface } from 'sequelize';

export = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.bulkInsert('dods_editorial_record_statuses', [
            {
                uuid: '89cf96f7-d380-4c30-abcf-74c57843f50c',
                status: 'Draft',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                uuid: 'b54bea83-fa06-4bd4-852d-08e5908c55b5',
                status: 'Ingested',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                uuid: 'a1c5e035-28d3-4ac3-b5b9-240e0b11dbce',
                status: 'Created',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                uuid: 'bbffb0d0-cb43-464d-a4ea-aa9ebd14a138',
                status: 'In progress',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                uuid: 'c6dadaed-de7f-45c1-bcdf-f3bbef389a60',
                status: 'Scheduled',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },
    down: (queryInterface: QueryInterface) => {
        return queryInterface.bulkDelete('dods_editorial_record_statuses', {});
    },
};

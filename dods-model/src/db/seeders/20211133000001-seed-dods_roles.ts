import { QueryInterface } from 'sequelize';

export = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.bulkInsert('dods_roles', [
            {
                uuid: '10c4c886-97a5-4dd1-93e7-7a51df1e9861',
                title: 'User',
                dods_role: 0,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                uuid: 'ae91d45d-ea24-42ed-90fc-c64e4ba4e87f',
                title: 'Admin',
                dods_role: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },
    down: (queryInterface: QueryInterface) => {
        return queryInterface.bulkDelete('dods_roles', {});
    },
};

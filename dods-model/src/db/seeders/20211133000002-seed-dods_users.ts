import { QueryInterface } from 'sequelize';

export = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.bulkInsert('dods_users', [
            {
                uuid: '6c16a036-2439-4b78-bf29-8069f4cd6c0b',
                role_id: 1,
                first_name: 'Joe',
                last_name: 'Myers',
                title: 'Mr',
                primary_email: 'joe@ex.com',
                secondary_email: 'joe1@ex.com',
                telephone_number_1: '+1772111727',
                telephone_number_2: '+1772111728',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                uuid: '6340c08f-0a01-41c1-8434-421f1fff3d1e',
                role_id: 1,
                first_name: 'Mark',
                last_name: 'Myers',
                title: 'Mr',
                primary_email: 'mark@ex.com',
                secondary_email: 'mark@ex.com',
                telephone_number_1: '+1872111727',
                telephone_number_2: '+1872111728',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },
    down: (queryInterface: QueryInterface) => {
        return queryInterface.bulkDelete('dods_users', {});
    },
};

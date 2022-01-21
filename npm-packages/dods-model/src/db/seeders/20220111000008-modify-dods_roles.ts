import { Op, QueryInterface, ValidationError } from 'sequelize';

const seedData = [
    {
        uuid: '5e2f23c3-1b53-4eea-b260-5d2cc05be38f',
        title: 'DODS Admin',
        dods_role: 1,
        updated_at: new Date(),
    },
    {
        uuid: '83618280-9c84-441c-94d1-59e4b24cbe3d',
        title: 'DODS Consultant',
        dods_role: 1,
        updated_at: new Date(),
    },
    {
        uuid: '31becb0d-6dc7-4aa6-801b-080692c7d6ae',
        title: 'DODS Account Manager',
        dods_role: 1,
        updated_at: new Date(),
    },
];

const uuidArray = seedData.map((item) => item.uuid);

export = {
    up: async (queryInterface: QueryInterface) => {
        //* Try to insert roles, if roles already exist then update their dods_role to true
        //* and update name of DODS Consultant.
        try {
            await queryInterface.bulkInsert('dods_roles', seedData);
        } catch (error) {
            if (error instanceof ValidationError) {
                await queryInterface.bulkUpdate(
                    'dods_roles',
                    { dods_role: 1 },
                    {
                        uuid: { [Op.or]: uuidArray },
                    }
                );
                await queryInterface.bulkUpdate(
                    'dods_roles',
                    { title: 'DODS Consultant' },
                    {
                        uuid: seedData[1].uuid,
                    }
                );
            } else {
                throw error;
            }
        }
        return;
    },
    down: async (queryInterface: QueryInterface) => {
        return queryInterface.bulkDelete('dods_roles', { uuid: { [Op.or]: uuidArray } });
    },
};

import { DataTypes, QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.addColumn('dods_editorial_records', 'schedule_date', {
                type: DataTypes.DATE,
                defaultValue: null,
                allowNull: true,
            }),
        ]);
    },
    down: async (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.removeColumn('dods_editorial_records', 'schedule_date'),
        ]);
    },
};

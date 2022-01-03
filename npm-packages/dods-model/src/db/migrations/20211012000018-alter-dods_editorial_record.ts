import { DataTypes, QueryInterface } from 'sequelize';

export = {
    up: (queryInterface: QueryInterface) => {
        return Promise.all([

            queryInterface.addColumn('dods_editorial_records', 'is_published', {
                type: DataTypes.TINYINT({ length: 1 }),
                allowNull: false,
                defaultValue: false,
            }),

            queryInterface.addColumn('dods_editorial_records', 'is_archived', {
                type: DataTypes.TINYINT({ length: 1 }),
                allowNull: false,
                defaultValue: false,
            }),

        ]);
    },
    down: (queryInterface: QueryInterface) => {

        return Promise.all([
            queryInterface.removeColumn('dods_editorial_records', 'is_published'),
            queryInterface.removeColumn('dods_editorial_records', 'is_archived'),
        ]);
    },
};

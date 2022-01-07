import { DataTypes, QueryInterface } from 'sequelize';

export = {
    up: (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.addColumn('dods_collections_alerts', 'is_published', {
                type: DataTypes.TINYINT({ length: 1 }),
                allowNull: false,
                defaultValue: false,
            }),
            queryInterface.addColumn('dods_collections_alerts', 'last_step_completed', {
                type: DataTypes.INTEGER({ length: 11 }),
                allowNull: false,
                defaultValue: 1
            }),
            queryInterface.addColumn('dods_collections_alerts', 'is_scheduled', {
                type: DataTypes.TINYINT({ length: 1 }),
                allowNull: false,
                defaultValue: false,
            }),
            queryInterface.addColumn('dods_collections_alerts', 'has_keywords_highlight', {
                type: DataTypes.TINYINT({ length: 1 }),
                allowNull: false,
                defaultValue: false,
            }),

        ]);
    },
    down: (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.removeColumn('dods_collections_alerts', 'is_published'),
            queryInterface.removeColumn('dods_collections_alerts', 'last_step_completed'),
            queryInterface.removeColumn('dods_collections_alerts', 'is_scheduled'),
            queryInterface.removeColumn('dods_collections_alerts', 'has_keywords_highlight'),
        ]);
    },
};

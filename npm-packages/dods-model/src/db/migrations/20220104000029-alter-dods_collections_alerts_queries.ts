import { DataTypes, QueryInterface } from 'sequelize';

export = {
    up: (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.addColumn('dods_collections_alerts_queries', 'information_types', {
                type: DataTypes.STRING({ length: 255 }),
                allowNull: true,
            }),
            queryInterface.addColumn('dods_collections_alerts_queries', 'content_sources', {
                type: DataTypes.STRING({ length: 255 }),
                allowNull: true,
            }),

        ]);
    },
    down: (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.removeColumn('dods_collections_alerts_queries', 'information_types'),
            queryInterface.removeColumn('dods_collections_alerts_queries', 'content_sources'),

        ]);
    },
};

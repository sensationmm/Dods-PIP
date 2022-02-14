import { DataTypes, QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.changeColumn('dods_collections_alerts_queries', 'information_types', {
                type: DataTypes.TEXT,
                allowNull: true,
                defaultValue: null
            }),
            queryInterface.changeColumn('dods_collections_alerts_queries', 'content_sources', {
                type: DataTypes.TEXT,
                allowNull: true,
                defaultValue: null
            }),
        ]);
    },
    down: async (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.changeColumn('dods_collections_alerts_queries', 'information_types', {
                type: DataTypes.STRING({ length: 255 }),
                allowNull: true,
            }),
            queryInterface.changeColumn('dods_collections_alerts_queries', 'content_sources', {
                type: DataTypes.STRING({ length: 255 }),
                allowNull: true,
            }),
        ]);
    },
};

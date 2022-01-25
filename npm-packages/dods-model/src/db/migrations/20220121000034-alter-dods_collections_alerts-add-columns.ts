import { DataTypes, QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.addColumn('dods_collections_alerts', 'elastic_query', {
            type: DataTypes.TEXT({ length: 'medium' }),
            defaultValue: null,
            allowNull: true,
        });
        return await queryInterface.addColumn('dods_collections_alerts', 'last_executed_at', {
            type: DataTypes.DATE,
            defaultValue: null,
            allowNull: true,
        });
    },
    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeColumn('dods_collections_alerts', 'elastic_query');
        return await queryInterface.removeColumn('dods_collections_alerts', 'last_executed_at');
    },
};

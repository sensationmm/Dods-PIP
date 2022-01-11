import { DataTypes, QueryInterface } from 'sequelize';

export = {
    up: (queryInterface: QueryInterface) => {
        return Promise.all([


            queryInterface.changeColumn('dods_collections_alerts_queries', 'name', {
                type: DataTypes.STRING({ length: 255 }),
                allowNull: true,
            }),

        ]);
    },
    down: (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.changeColumn('dods_collections_alerts_queries', 'schedule', {
                type: DataTypes.STRING({ length: 255 }),
                allowNull: false,
            }),
        ]);
    },
};

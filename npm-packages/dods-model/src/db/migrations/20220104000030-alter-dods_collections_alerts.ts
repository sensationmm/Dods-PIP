import { DataTypes, QueryInterface } from 'sequelize';

export = {
    up: (queryInterface: QueryInterface) => {
        return Promise.all([


            queryInterface.changeColumn('dods_collections_alerts', 'schedule', {
                type: DataTypes.STRING({ length: 255 }),
                allowNull: true,
            }),

            queryInterface.changeColumn('dods_collections_alerts', 'timezone', {
                type: DataTypes.STRING({ length: 255 }),
                allowNull: true,
            })

        ]);
    },
    down: (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.changeColumn('dods_collections_alerts', 'schedule', {
                type: DataTypes.STRING({ length: 255 }),
                allowNull: false,
            }),

            queryInterface.changeColumn('dods_collections_alerts', 'timezone', {
                type: DataTypes.STRING({ length: 255 }),
                allowNull: false,
            })
        ]);
    },
};

import { DataTypes, QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.addColumn('dods_collections_alerts_recipients', 'is_active', {
                type: DataTypes.TINYINT({ length: 1 }),
                allowNull: false,
                defaultValue: 1,
            }),
            queryInterface.addColumn('dods_collections_alerts_recipients', 'updated_by', {
                type: DataTypes.INTEGER({ length: 11 }),
                allowNull: true,
                defaultValue: null,
                references: {
                    model: 'dods_users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            })
        ]);
    },
    down: async (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.removeColumn('dods_collections_alerts_recipients', 'is_active'),
            queryInterface.removeColumn('dods_collections_alerts_recipients', 'updated_by'),
        ]);
    },
};

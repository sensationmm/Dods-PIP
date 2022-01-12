import { DataTypes, QueryInterface } from 'sequelize';

export = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.addColumn('dods_collections', 'created_by_id', {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: true,
            references: {
                model: 'dods_users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });
    },
    down: (queryInterface: QueryInterface) => {
        return queryInterface.removeColumn('dods_collections', 'created_by_id');
    },
};

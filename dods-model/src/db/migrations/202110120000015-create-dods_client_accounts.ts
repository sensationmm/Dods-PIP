import { DataTypes, QueryInterface } from 'sequelize';

export = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.addColumn(
            'dods_client_accounts',
            'is_dods_account',

            {
                type: DataTypes.TINYINT({ length: 1 }),
                allowNull: false,
                defaultValue: 0,
            }
        );
    },
    down: (queryInterface: QueryInterface) => {
        return queryInterface.removeColumn(
            'dods_client_accounts',
            'is_dods_account'
        );
    },
};

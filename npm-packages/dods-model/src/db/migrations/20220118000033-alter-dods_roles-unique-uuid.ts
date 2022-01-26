import { DataTypes, QueryInterface } from 'sequelize';

export = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.changeColumn('dods_roles', 'uuid', {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
        });
    },
    down: (queryInterface: QueryInterface) => {
        return queryInterface.changeColumn('dods_roles', 'uuid', {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: false,
        });
    },
};

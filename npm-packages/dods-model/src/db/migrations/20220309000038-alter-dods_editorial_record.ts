import { DataTypes, QueryInterface } from 'sequelize';

export = {
    up: async (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.changeColumn('dods_editorial_records', 'document_name', {
                type: DataTypes.STRING({ length: 200 }),
                allowNull: false,
            })
        ]);
    },
    down: async (queryInterface: QueryInterface) => {
        return Promise.all([
            queryInterface.changeColumn('dods_editorial_records', 'document_name', {
                type: DataTypes.STRING({ length: 100 }),
                allowNull: false,
            })
        ]);
    },
};

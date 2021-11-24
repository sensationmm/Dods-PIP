import { DataTypes, QueryInterface } from 'sequelize';

export = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.changeColumn('dods_users', 'title', { type: DataTypes.STRING({ length: 150 }), allowNull: true, defaultValue: null });
  },
  down: (queryInterface: QueryInterface) => {
    return queryInterface.changeColumn('dods_users', 'title', { type: DataTypes.STRING({ length: 150 }), allowNull: false });
  }
};
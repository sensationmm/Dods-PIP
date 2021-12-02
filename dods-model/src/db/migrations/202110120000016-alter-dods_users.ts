import { Sequelize } from 'sequelize';
import { DataTypes, QueryInterface } from 'sequelize';

export = {
  up: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.addColumn('dods_users', 'is_active', { type: DataTypes.TINYINT({ length: 1 }), allowNull: false, defaultValue: 1 }),
      queryInterface.addColumn('dods_users', 'memberSince', { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }),
    ]);
  },
  down: (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('dods_users', 'is_active'),
      queryInterface.removeColumn('dods_users', 'memberSince'),
    ]);
  }
};
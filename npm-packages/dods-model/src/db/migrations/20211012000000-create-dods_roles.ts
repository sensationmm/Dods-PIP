import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable('dods_roles', {
      id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING({ length: 45 }),
        allowNull: false,
      },
      dods_role: {
        type: DataTypes.TINYINT({ length: 1 }),
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      }
    });
  },
  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable('dods_roles');
  }
};
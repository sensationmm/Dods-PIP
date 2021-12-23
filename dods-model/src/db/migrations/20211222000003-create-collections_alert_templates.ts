import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable('dods_collection_alert_templates', {
      id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING({ length: 255 }),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: true,
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
    return queryInterface.dropTable('dods_collection_alert_templates');
  }
};
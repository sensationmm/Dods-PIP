import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable('dods_subscription_types', {
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
      name: {
        type: DataTypes.STRING({ length: 100 }),
        allowNull: false,
        unique: true
      },
      location: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: null
      },
      content_type: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: null
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
    return queryInterface.dropTable('dods_subscription_types');
  }
};
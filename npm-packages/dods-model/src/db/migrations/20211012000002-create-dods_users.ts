import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable('dods_users', {
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
      role_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'dods_roles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      first_name: {
        type: DataTypes.STRING({ length: 50 }),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING({ length: 50 }),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING({ length: 150 }),
        allowNull: false,
      },
      primary_email: {
        type: DataTypes.STRING({ length: 100 }),
        allowNull: false,
      },
      secondary_email: {
        type: DataTypes.STRING({ length: 100 }),
        allowNull: true,
        defaultValue: null
      },
      telephone_number_1: {
        type: DataTypes.STRING({ length: 20 }),
        allowNull: true,
        defaultValue: null
      },
      telephone_number_2: {
        type: DataTypes.STRING({ length: 20 }),
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
    return queryInterface.dropTable('dods_users');
  }
};
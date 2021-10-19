import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable('dods_client_accounts', {
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
      subscription: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'dods_subscription_types',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      subscription_seats: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
      },
      contact_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      contact_email_address: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      contact_telephone_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      consultant_hours: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: true
      },
      contract_start_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      contract_end_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      contract_rollover: {
        type: DataTypes.TINYINT({ length: 1 }),
        allowNull: true,
        defaultValue: null
      },
      sales_contact: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'dods_users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      is_completed: {
        type: DataTypes.TINYINT({ length: 1 }),
        allowNull: false,
        defaultValue: 0
      },
      last_step_completed: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: 4
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      }
    });
  },
  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable('dods_client_accounts');
  }
};
import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable('dods_collections_saved_queries', {
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
      collection_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: null,
        references: {
          model: 'dods_collections',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: DataTypes.STRING({ length: 255 }),
        allowNull: false,
      },
      query: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'dods_users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_by: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'dods_users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    return queryInterface.dropTable('dods_collections_saved_queries');
  }
};
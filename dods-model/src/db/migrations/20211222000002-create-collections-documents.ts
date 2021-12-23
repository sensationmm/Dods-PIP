import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable('dods_collections_documents', {
      collection_id: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        defaultValue: null,
        primaryKey: true,
        references: {
          model: 'dods_collections',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      document_id: {
        type: DataTypes.STRING({ length: 36 }),
        allowNull: false,
        primaryKey: true
      },
      added_by: {
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
      addet_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    });
  },
  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable('dods_collections_documents');
  }
};
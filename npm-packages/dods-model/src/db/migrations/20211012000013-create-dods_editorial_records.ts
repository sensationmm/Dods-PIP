import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.createTable('dods_editorial_records', {
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
            document_name: {
                type: DataTypes.STRING({ length: 100 }),
                allowNull: false,
            },
            s3_location: {
                type: DataTypes.STRING({ length: 200 }),
                allowNull: false,
            },
            information_type: {
                type: DataTypes.STRING({ length: 100 }),
                allowNull: true,
            },
            content_source: {
                type: DataTypes.STRING({ length: 100 }),
                allowNull: true,
            },
            assigned_editor_id: {
                type: DataTypes.INTEGER({ length: 11 }),
                allowNull: true,
                defaultValue: null,
                references: {
                    model: 'dods_users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            status_id: {
                type: DataTypes.INTEGER({ length: 11 }),
                allowNull: true,
                defaultValue: null,
                references: {
                    model: 'dods_editorial_record_statuses',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null,
            },
        });
    },
    down: (queryInterface: QueryInterface) => {
        return queryInterface.dropTable('dods_editorial_records');
    },
};

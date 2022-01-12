import {
    Association,
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    Model,
    Optional,
} from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';

import { CollectionAlert } from '.';

interface AlertDocumentAttributes {
    alertId: number;
    documentId: string;
    createdBy: number;
}

export interface AlertDocumentInput
    extends Optional<
    AlertDocumentAttributes,
    | 'alertId'
    | 'documentId'
    | 'createdBy'
    > { }


export interface AlertDocumentOutput extends Required<AlertDocumentAttributes> { }

export class CollectionAlertDocument
    extends Model<AlertDocumentAttributes, AlertDocumentInput>
    implements AlertDocumentAttributes, AlertDocumentOutput {

    public alertId!: number;
    public documentId!: string;
    public createdBy!: number;

    // mixins for association (optional)
    public readonly alert!: CollectionAlert;
    public getAlert!: BelongsToGetAssociationMixin<CollectionAlert>;
    public setAlert!: BelongsToSetAssociationMixin<CollectionAlert, number>;
    public createAlert!: BelongsToCreateAssociationMixin<CollectionAlert>;

    public static associations: {
        collection: Association<CollectionAlertDocument, CollectionAlert>;
    };

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

CollectionAlertDocument.init(
    {
        alertId: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: false,
            defaultValue: null,
            primaryKey: true,
            references: {
                model: 'dods_collections_alerts',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        documentId: {
            type: DataTypes.STRING({ length: 36 }),
            allowNull: false,
            primaryKey: true
        },
        createdBy: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'dods_users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        }
    },
    {
        tableName: 'dods_collections_alerts_documents',
        underscored: true,
        timestamps: true,
        sequelize: sequelizeConnection,
        // paranoid: true
    }
);

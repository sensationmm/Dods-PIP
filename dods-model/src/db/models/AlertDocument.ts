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
import { Alert } from './Alert';

interface AlertDocumentAttributes {
    alertId: number;
    documentId: string;
    addedBy: number;
}

export interface AlertDocumentInput
    extends Optional<
    AlertDocumentAttributes,
        | 'alertId'
        | 'documentId'
        | 'addedBy'
    > {}


export interface AlertDocumentOutput
    extends Required<AlertDocumentAttributes> {}

export class AlertDocument
    extends Model<AlertDocumentAttributes, AlertDocumentInput>
    implements AlertDocumentAttributes, AlertDocumentOutput
{
    public alertId!: number;
    public documentId!: string;
    public addedBy!: number;

    // mixins for association (optional)
    public readonly alert!: Alert;
    public getAlert!: BelongsToGetAssociationMixin<Alert>;
    public setAlert!: BelongsToSetAssociationMixin<
        Alert,
        number
    >;
    public createAlert!: BelongsToCreateAssociationMixin<Alert>;

    public static associations: {
        collection: Association<AlertDocument, Alert>;
        
    };

    // Timestamps
    public readonly addedAt!: Date;
}

AlertDocument.init(
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
          addedBy: {
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

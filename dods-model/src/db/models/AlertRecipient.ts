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
import { User } from '.';

interface AlertRecipientAttributes {
    alertId: number;
    userId: number;
    addedBy: number;
}

export interface AlertRecipientInput
    extends Optional<
    AlertRecipientAttributes,
        | 'alertId'
        | 'userId'
        | 'addedBy'
    > {}


export interface AlertRecipientOutput
    extends Required<AlertRecipientAttributes> {}

export class AlertRecipient
    extends Model<AlertRecipientAttributes, AlertRecipientInput>
    implements AlertRecipientAttributes, AlertRecipientOutput
{
    public alertId!: number;
    public userId!: number;
    public addedBy!: number;
    
    // mixins for association (optional)
    public readonly alert!: Alert;
    public getAlert!: BelongsToGetAssociationMixin<Alert>;
    public setAlert!: BelongsToSetAssociationMixin<
        Alert,
        number
    >;
    public createAlert!: BelongsToCreateAssociationMixin<Alert>;

    public readonly user!: User;
    public getUser!: BelongsToGetAssociationMixin<User>;
    public setUser!: BelongsToSetAssociationMixin<
        User,
        number
    >;
    public createUser!: BelongsToCreateAssociationMixin<User>;

    public static associations: {
        alert: Association<AlertRecipient, Alert>;
        user: Association<AlertRecipient, User>;
    };

    // Timestamps
    public readonly addedAt!: Date;
}

AlertRecipient.init(
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
          userId: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: false,
            defaultValue: null,
            primaryKey: true,
            references: {
              model: 'dods_users',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'DELETE'
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
          },
          
    },
    {
        tableName: 'dods_collections_alerts_recipients',
        underscored: true,
        timestamps: true,
        sequelize: sequelizeConnection,
        // paranoid: true
    }
);

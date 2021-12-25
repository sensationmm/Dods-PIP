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

import { User, CollectionAlert } from '.';

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
    > { }


export interface AlertRecipientOutput extends Required<AlertRecipientAttributes> { }

export class CollectionAlertRecipient
    extends Model<AlertRecipientAttributes, AlertRecipientInput>
    implements AlertRecipientAttributes, AlertRecipientOutput {

    public alertId!: number;
    public userId!: number;
    public addedBy!: number;

    // mixins for association (optional)
    public readonly alert!: CollectionAlert;
    public getAlert!: BelongsToGetAssociationMixin<CollectionAlert>;
    public setAlert!: BelongsToSetAssociationMixin<CollectionAlert, number>;
    public createAlert!: BelongsToCreateAssociationMixin<CollectionAlert>;

    public readonly user!: User;
    public getUser!: BelongsToGetAssociationMixin<User>;
    public setUser!: BelongsToSetAssociationMixin<User, number>;
    public createUser!: BelongsToCreateAssociationMixin<User>;

    public static associations: {
        alert: Association<CollectionAlertRecipient, CollectionAlert>;
        user: Association<CollectionAlertRecipient, User>;
    };

    // Timestamps
    public readonly addedAt!: Date;
}

CollectionAlertRecipient.init(
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
            primaryKey: true,
            references: {
                model: 'dods_users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
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
            onDelete: 'CASCADE'
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

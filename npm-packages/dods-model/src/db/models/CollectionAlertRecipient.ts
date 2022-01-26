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
    createdBy: number;
    isActive: boolean;
    updatedBy?: number;
}

export interface AlertRecipientInput
    extends Optional<
    AlertRecipientAttributes,
    | 'alertId'
    | 'userId'
    | 'createdBy'
    | 'isActive'
    | 'updatedBy'
    > { }


export interface AlertRecipientOutput extends Required<AlertRecipientAttributes> { }

export class CollectionAlertRecipient
    extends Model<AlertRecipientAttributes, AlertRecipientInput>
    implements AlertRecipientAttributes, AlertRecipientOutput {

    public alertId!: number;
    public userId!: number;
    public createdBy!: number;
    public isActive!: boolean;
    public updatedBy!: number;

    // mixins for association (optional)
    public readonly alert!: CollectionAlert;
    public getAlert!: BelongsToGetAssociationMixin<CollectionAlert>;
    public setAlert!: BelongsToSetAssociationMixin<CollectionAlert, number>;
    public createAlert!: BelongsToCreateAssociationMixin<CollectionAlert>;

    public readonly user!: User;
    public getUser!: BelongsToGetAssociationMixin<User>;
    public setUser!: BelongsToSetAssociationMixin<User, number>;
    public createUser!: BelongsToCreateAssociationMixin<User>;

    public readonly createdById!: User;
    public getCreatedId!: BelongsToGetAssociationMixin<User>;
    public setCreatedId!: BelongsToSetAssociationMixin<User, number>;

    public readonly updatedId!: User;
    public getUpdatedById!: BelongsToGetAssociationMixin<User>;
    public setUpdatedById!: BelongsToSetAssociationMixin<User, number>;

    public static associations: {
        alert: Association<CollectionAlertRecipient, CollectionAlert>;
        user: Association<CollectionAlertRecipient, User>;
        createdById: Association<CollectionAlertRecipient, User>;
        updatedById: Association<CollectionAlertRecipient, User>;
    };

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
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
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1,
            allowNull: true,
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
            onDelete: 'CASCADE'
        },
        updatedBy: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'dods_users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        }
    },
    {
        tableName: 'dods_collections_alerts_recipients',
        underscored: true,
        timestamps: true,
        sequelize: sequelizeConnection,
        // paranoid: true
    }
);

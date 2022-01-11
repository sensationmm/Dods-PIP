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
    id: number;
    alertId: number;
    userId: number;
    createdBy: number;
}

export interface AlertRecipientInput
    extends Optional<
    AlertRecipientAttributes,
    | 'id'
    | 'alertId'
    | 'userId'
    | 'createdBy'
    > { }


export interface AlertRecipientOutput extends Required<AlertRecipientAttributes> { }

export class CollectionAlertRecipient
    extends Model<AlertRecipientAttributes, AlertRecipientInput>
    implements AlertRecipientAttributes, AlertRecipientOutput {

    public id!: number;
    public alertId!: number;
    public userId!: number;
    public createdBy!: number;

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
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

CollectionAlertRecipient.init(
    {
        id: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        alertId: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: false,
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
            references: {
                model: 'dods_users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
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
    },
    {
        tableName: 'dods_collections_alerts_recipients',
        underscored: true,
        timestamps: true,
        sequelize: sequelizeConnection,
        // paranoid: true
    }
);

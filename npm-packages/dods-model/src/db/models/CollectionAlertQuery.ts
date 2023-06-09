import {
    Association,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    Model,
    Optional,
} from 'sequelize';

import { User } from '.';
import sequelizeConnection from '../config/sequelizeConnection';

interface AlertQueryAttributes {
    id: number;
    uuid: string;
    alertId: number;
    name: string;
    query: string;
    isActive: boolean;
    informationTypes: string;
    contentSources: string;
    createdBy: number;
    updatedBy: number;
}

export interface AlertQueryInput
    extends Optional<
    AlertQueryAttributes,
    | 'id'
    | 'uuid'
    | 'alertId'
    | 'name'
    | 'query'
    | 'createdBy'
    | 'informationTypes'
    | 'contentSources'
    > { }


export interface AlertQueryOutput extends Required<AlertQueryAttributes> { }

export class CollectionAlertQuery
    extends Model<AlertQueryAttributes, AlertQueryInput>
    implements AlertQueryAttributes, AlertQueryOutput {

    public id!: number;
    public uuid!: string;
    public alertId!: number;
    public name!: string;
    public query!: string;
    public createdBy!: number;
    public updatedBy!: number;
    informationTypes!: string;
    contentSources!: string;

    public isActive!: boolean;

    // mixins for association (optional)

    public readonly createdById!: User;
    public getCreatedBy!: BelongsToGetAssociationMixin<User>;
    public setCreatedBy!: BelongsToSetAssociationMixin<User, number>;

    public readonly updatedById!: User;
    public getUpdatedById!: BelongsToGetAssociationMixin<User>;
    public setUpdatedById!: BelongsToSetAssociationMixin<User, number>;

    public static associations: {
        createdById: Association<CollectionAlertQuery, User>;
        updatedById: Association<CollectionAlertQuery, User>;
    };

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

CollectionAlertQuery.init(
    {
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
        alertId: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: false,
            references: {
                model: 'dods_collections_alerts',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        name: {
            type: DataTypes.STRING({ length: 255 }),
            allowNull: true,
        },
        query: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
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
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        updatedBy: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'dods_users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        informationTypes: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        },
        contentSources: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        },
    },
    {
        tableName: 'dods_collections_alerts_queries',
        underscored: true,
        timestamps: true,
        sequelize: sequelizeConnection,
        paranoid: true,
    }
);

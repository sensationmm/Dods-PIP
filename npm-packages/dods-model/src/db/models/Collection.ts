import {
    Association,
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToMany,
    BelongsToManyGetAssociationsMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    Model,
    Optional,
} from 'sequelize';
import { ClientAccount, CollectionAlert, CollectionDocument, CollectionSavedQuery, User } from '.';

import sequelizeConnection from '../config/sequelizeConnection';

interface CollectionAttributes {
    id: number;
    uuid: string;
    name: string;
    isActive: boolean;
    clientAccountId: number;
    createdById?: number | null;
    updatedById?: number | null;
}

export interface CollectionInput
    extends Optional<
    CollectionAttributes,
    | 'id'
    | 'uuid'
    | 'name'
    | 'isActive'
    | 'clientAccountId'
    | 'createdById'
    | 'updatedById'
    > { }

export interface CollectionOutput extends Required<CollectionAttributes> { }

export class Collection
    extends Model<CollectionAttributes, CollectionInput>
    implements CollectionAttributes, CollectionOutput {
    public id!: number;
    public uuid!: string;
    public name!: string;
    public clientAccountId!: number;
    public createdById!: number | null;
    public updatedById!: number | null;

    public isActive!: boolean;

    // mixins for association (optional)
    public readonly clientAccount!: ClientAccount;
    public getClientAccount!: BelongsToGetAssociationMixin<ClientAccount>;
    public setClientAccount!: BelongsToSetAssociationMixin<ClientAccount, number>;
    public createClientAccount!: BelongsToCreateAssociationMixin<ClientAccount>;

    public readonly createdBy!: User;
    public getCreatedBy!: BelongsToGetAssociationMixin<User>;
    public setCreatedBy!: BelongsToSetAssociationMixin<User, number>;

    public readonly updatedBy!: User;
    public getUpdatedBy!: BelongsToGetAssociationMixin<User>;
    public setUpdatedBy!: BelongsToSetAssociationMixin<User, number>;

    public readonly savedQueries?: CollectionSavedQuery[];
    public getSavedQueries!: BelongsToManyGetAssociationsMixin<CollectionSavedQuery>;
    public SavedQueries?: CollectionSavedQuery[];

    public readonly alerts?: CollectionAlert[];
    public getAlerts!: BelongsToManyGetAssociationsMixin<CollectionAlert>;
    public Alerts?: CollectionAlert[];

    public readonly documents?: CollectionDocument[];
    public getDocuments!: BelongsToManyGetAssociationsMixin<CollectionDocument>;
    public Documents?: CollectionDocument[];

    public static associations: {
        clientAccount: Association<Collection, ClientAccount>;
        createdBy: Association<Collection, User>;
        updatedBy: Association<Collection, User>;
        savedQueries: BelongsToMany<Collection, CollectionSavedQuery>;
        alerts: BelongsToMany<Collection, CollectionAlert>;
        documents: BelongsToMany<Collection, CollectionDocument>;
    };

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

Collection.init(
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
        name: {
            type: DataTypes.STRING({ length: 255 }),
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: true,
        },
        clientAccountId: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: false,
            references: {
                model: 'dods_client_accounts',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        createdById: {
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
        updatedById: {
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
        tableName: 'dods_collections',
        underscored: true,
        timestamps: true,
        sequelize: sequelizeConnection,
        paranoid: true,
    }
);

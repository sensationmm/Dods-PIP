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
<<<<<<< HEAD
import sequelizeConnection from '../config/sequelizeConnection';
import { ClientAccount, CollectionSavedQuery, CollectionDocument, CollectionAlert } from './';
=======
import { ClientAccount } from '.';
import sequelizeConnection from '../config/sequelizeConnection';
import { SavedQuery } from './SavedQuery';
import { CollectionDocument } from './CollectionDocument';
import { Alert } from './Alert';
>>>>>>> c1d8d6887ad49e293b83236e47db4c92ee7028d9

interface CollectionAttributes {
    id: number;
    uuid: string;
<<<<<<< HEAD
    clientAccountId: number;
=======
    clientAccountId: number;
>>>>>>> c1d8d6887ad49e293b83236e47db4c92ee7028d9
    name: string;
    isActive: boolean;
}

export interface CollectionInput
    extends Optional<
    CollectionAttributes,
    | 'id'
    | 'uuid'
    | 'clientAccountId'
    | 'name'
    > { }


export interface CollectionOutput extends Required<CollectionAttributes> { }

export class Collection
    extends Model<CollectionAttributes, CollectionInput>
    implements CollectionAttributes, CollectionOutput {

    public id!: number;
    public uuid!: string;
    public clientAccountId!: number;
    public name!: string;

    public isActive!: boolean;

    // mixins for association (optional)
    public readonly clientAccount!: ClientAccount;
    public getClientAccount!: BelongsToGetAssociationMixin<ClientAccount>;
    public setClientAccount!: BelongsToSetAssociationMixin<ClientAccount, number>;
    public createClientAccount!: BelongsToCreateAssociationMixin<ClientAccount>;

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
        name: {
            type: DataTypes.STRING({ length: 255 }),
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
            allowNull: true,
        },
    },
    {
        tableName: 'dods_collections',
        underscored: true,
        timestamps: true,
        sequelize: sequelizeConnection,
        // paranoid: true
    }
);

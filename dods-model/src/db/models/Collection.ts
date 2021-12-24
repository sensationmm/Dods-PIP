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
import { ClientAccount } from '.';
import sequelizeConnection from '../config/sequelizeConnection';
import { SavedQuery } from './SavedQuery';
import { CollectionDocument } from './CollectionDocument';
import { Alert } from './Alert';

interface CollectionAttributes {
    id: number;
    uuid: string;
    clientAccountId: number; 
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
    > {}


export interface CollectionOutput
    extends Required<CollectionAttributes> {}

export class Collection
    extends Model<CollectionAttributes, CollectionInput>
    implements CollectionAttributes, CollectionOutput
{
    public id!: number;
    public uuid!: string;
    public clientAccountId!: number;
    public name!: string;
    
    public isActive!: boolean;
    // mixins for association (optional)
    public readonly clientAccount!: ClientAccount;
    public getClientAccount!: BelongsToGetAssociationMixin<ClientAccount>;
    public setClientAccount!: BelongsToSetAssociationMixin<
        ClientAccount,
        number
    >;
    public createClientAccount!: BelongsToCreateAssociationMixin<ClientAccount>;

    public readonly savedQueries?: SavedQuery[];
    public getSavedQueries!: BelongsToManyGetAssociationsMixin<SavedQuery>;
    public SavedQueries?: SavedQuery[];

    public readonly alerts?: Alert[];
    public getAlerts!: BelongsToManyGetAssociationsMixin<Alert>;
    public Alerts?: Alert[];

    public readonly documents?: CollectionDocument[];
    public getDocuments!: BelongsToManyGetAssociationsMixin<CollectionDocument>;
    public Documents?: CollectionDocument[];



    public static associations: {
        clientAccount: Association<Collection, ClientAccount>;
        savedQueries: BelongsToMany<Collection, SavedQuery>;
        alerts: BelongsToMany<Collection, Alert>;
        collectionDocuments: BelongsToMany<Collection, CollectionDocument>;
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
            defaultValue: null,
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

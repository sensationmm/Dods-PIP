import {
    Association,
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    Model,
    Optional,
} from 'sequelize';
import { Collection } from './Collection';

import sequelizeConnection from '../config/sequelizeConnection';

interface SavedQueryAttributes {
    id: number;
    uuid: string;
    collectionId: number; 
    name: string;
    query: string;
    isActive: boolean;
    createdBy: number;
    updatedBy: number;
}

export interface SavedQueryInput
    extends Optional<
    SavedQueryAttributes,
        | 'id'
        | 'uuid'
        | 'collectionId'
        | 'name'
        |  'query'
        |  'createdBy'
    > {}


export interface SavedQueryOutput
    extends Required<SavedQueryAttributes> {}

export class SavedQuery
    extends Model<SavedQueryAttributes, SavedQueryInput>
    implements SavedQueryAttributes, SavedQueryOutput
{
    public id!: number;
    public uuid!: string;
    public collectionId!: number;
    public name!: string;
    public query!: string;
    public createdBy!: number;
    public updatedBy!: number;
    
    public isActive!: boolean;
    // mixins for association (optional)
    public readonly collection!: Collection;
    public getCollection!: BelongsToGetAssociationMixin<Collection>;
    public setCollection!: BelongsToSetAssociationMixin<
        Collection,
        number
    >;
    public createCollection!: BelongsToCreateAssociationMixin<Collection>;

    public static associations: {
        collection: Association<SavedQuery, Collection>;
    };

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

SavedQuery.init(
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
          collectionId: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: false,
            defaultValue: null,
            references: {
              model: 'dods_collections',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          },
          name: {
            type: DataTypes.STRING({ length: 255 }),
            allowNull: false,
          },
          query: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
          },
          isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
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
            onDelete: 'SET NULL'
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
            onDelete: 'SET NULL'
          },
    },
    {
        tableName: 'dods_collections_saved_queries',
        underscored: true,
        timestamps: true,
        sequelize: sequelizeConnection,
        // paranoid: true
    }
);

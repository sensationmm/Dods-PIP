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

import { Collection } from './';

interface CollectionDocumentAttributes {
    collectionId: number;
    documentId: string;
    createdBy: number;
}

export interface CollectionDocumentInput
    extends Optional<
    CollectionDocumentAttributes,
    | 'collectionId'
    | 'documentId'
    | 'createdBy'
    > { }

export interface CollectionDocumentOutput extends Required<CollectionDocumentAttributes> { }

export class CollectionDocument
    extends Model<CollectionDocumentAttributes, CollectionDocumentInput>
    implements CollectionDocumentAttributes, CollectionDocumentOutput {

    public collectionId!: number;
    public documentId!: string;
    public createdBy!: number;

    // mixins for association (optional)
    public readonly collection!: Collection;
    public getCollection!: BelongsToGetAssociationMixin<Collection>;
    public setCollection!: BelongsToSetAssociationMixin<Collection, number>;
    public createCollection!: BelongsToCreateAssociationMixin<Collection>;

    public static associations: {
        collection: Association<CollectionDocument, Collection>;
    };

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

CollectionDocument.init(
    {
        collectionId: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: false,
            defaultValue: null,
            primaryKey: true,
            references: {
                model: 'dods_collections',
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
        }
    },
    {
        tableName: 'dods_collections_documents',
        underscored: true,
        timestamps: true,
        sequelize: sequelizeConnection,
        // paranoid: true
    }
);

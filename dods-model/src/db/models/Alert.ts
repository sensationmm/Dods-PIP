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
import { Collection } from './Collection';
import { AlertTemplate } from './AlertTemplate';

import sequelizeConnection from '../config/sequelizeConnection';
import { AlertQuery } from './AlertQuery';

interface AlertAttributes {
    id: number;
    uuid: string;
    collectionId: number; 
    templateId: number; 
    title: string;
    description: string;
    schedule: string;
    timezone: string;
    createdBy: number;
    updatedBy: number;
    isActive: boolean;
}

export interface AlertInput
    extends Optional<
    AlertAttributes,
        | 'id'
        | 'uuid'
        | 'collectionId'
        | 'title'
        | 'description'
        | 'createdBy'
        | 'templateId'
        | 'schedule'
        | 'timezone'
    > {}


export interface AlertOutput
    extends Required<AlertAttributes> {}

export class Alert
    extends Model<AlertAttributes, AlertInput>
    implements AlertAttributes, AlertOutput
{
    public id!: number;
    public uuid!: string;
    public collectionId!: number;
    public templateId!: number;
    public title!: string;
    public description!: string;
    public schedule!: string;
    public timezone!: string;
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

    public readonly alertTemplate!: AlertTemplate;
    public getAlertTemplate!: BelongsToGetAssociationMixin<AlertTemplate>;
    public setAlertTemplate!: BelongsToSetAssociationMixin<
        AlertTemplate,
        number
    >;
    public createAlertTemplate!: BelongsToCreateAssociationMixin<Collection>;

    public readonly alertQueries?: AlertQuery[];
    public getAlertQueries!: BelongsToManyGetAssociationsMixin<AlertQuery>;
    public AlertQueries?: AlertQuery[];

    public static associations: {
        collection: Association<Alert, Collection>;
        alertTemplate: Association<Alert, AlertTemplate>;
        alertQueries: BelongsToMany<Collection, AlertQuery>;
    };

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

Alert.init(
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
          title: {
            type: DataTypes.STRING({ length: 255 }),
            allowNull: true,
          },
          description: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
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
          templateId: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: true,
            defaultValue: null,
            references: {
              model: 'dods_collections_alert_templates',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
          },
          schedule: {
            type: DataTypes.STRING({ length: 255 }),
            allowNull: false,
          },
          timezone: {
            type: DataTypes.STRING({ length: 255 }),
            allowNull: false,
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
        tableName: 'dods_collections_alerts',
        underscored: true,
        timestamps: true,
        sequelize: sequelizeConnection,
        // paranoid: true
    }
);

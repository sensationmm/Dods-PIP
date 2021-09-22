import {
    Association,
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    DataTypes,
    Model,
} from 'sequelize';
import {
    ClientAccountModelAttributes,
    ClientAccountModelCreationAttributes,
} from '../types';

import SubscriptionType from './SubscriptionType';
import sequelize from '../sequelize';

class ClientAccountModel
    extends Model<
        ClientAccountModelAttributes,
        ClientAccountModelCreationAttributes
    >
    implements ClientAccountModelAttributes
{
    public id!: number;
    public uuid!: string;
    public name!: string;
    public notes!: string | null;
    public contactName!: string;
    public contactEmailAddress!: string;
    public contactTelephoneNumber!: string;
    public subscriptionSeats!: number;
    public contractStartDate!: Date;
    public contractRollover!: boolean;
    public contractEndDate!: Date | null;
    public subscription?: SubscriptionType;


    //Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;

    //Model Associations
    public getSubscription!: BelongsToGetAssociationMixin<SubscriptionType>;
    public setSubscription!: BelongsToCreateAssociationMixin<SubscriptionType>;

    public static associations: {
        subscription: Association<ClientAccountModel, SubscriptionType>;
    };
}

ClientAccountModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            comment: 'null',
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'null',
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'null',
        },
        contactName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'null',
        },
        contactEmailAddress: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'null',
        },
        contactTelephoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
            comment: 'null',
        },
        subscriptionSeats: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        contractStartDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'null',
        },
        contractEndDate: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'null',
        },
        contractRollover: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            comment: 'null',
        },
    },
    {
        underscored: true,
        tableName: 'dods_client_accounts',
        sequelize,
    }
);

export default ClientAccountModel;

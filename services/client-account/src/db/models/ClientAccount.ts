import {
    BelongsToGetAssociationMixin,
    BelongsToManyAddAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    Model,
} from 'sequelize';
import {
    ClientAccountModelAttributes,
    ClientAccountModelCreationAttributes,
} from '../types';
//import SubscriptionType from './SubscriptionType';
import { SubscriptionTypeModel, UserProfileModel } from '.';

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
    public notes?: string;
    public contactName!: string;
    public contactEmailAddress!: string;
    public contactTelephoneNumber!: string;
    public subscriptionSeats?: number;
    public contractStartDate?: Date;
    public contractRollover?: boolean;
    public contractEndDate?: Date;
    public consultantHours?: number;
    public isUk?: boolean;
    public isEu?: boolean;
    public isCompleted!: boolean;
    public lastStepCompleted!: number;

    //Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;

    //Model Associations
    public getSubscriptionType!: BelongsToGetAssociationMixin<SubscriptionType>;
    public setSubscriptionType!: BelongsToSetAssociationMixin<
        SubscriptionType,
        number
    >;

    public getTeam!: BelongsToManyGetAssociationsMixin<UserProfileModel>;
    public addTeam!: BelongsToManyAddAssociationMixin<UserProfileModel, number>;

    public subscriptionType?: SubscriptionTypeModel;
    public team?: UserProfileModel[];

    // public static associations: {
    //     subscription: Association<ClientAccountModel, SubscriptionTypeModel>;
    // };
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
            allowNull: true,
        },

        consultantHours: {
            type: DataTypes.INTEGER,
            allowNull: true,
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
        isUk: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
            allowNull: true,
        },
        isEu: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
            allowNull: true,
        },
        isCompleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
            allowNull: false,
        },
        lastStepCompleted: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    },
    {
        underscored: true,
        tableName: 'dods_client_accounts',
        sequelize,
    }
);

export default ClientAccountModel;

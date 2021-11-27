import {
    Association,
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    Model,
    Optional,
} from 'sequelize';
import { SubscriptionType, User } from './';

import sequelizeConnection from '../config/sequelizeConnection';

interface ClientAccountAttributes {
    id: number;
    uuid: string;
    subscription: number | null;
    subscriptionSeats: number;
    name: string;
    notes: string | null;
    contactName: string;
    contactEmailAddress: string;
    contactTelephoneNumber: string;
    consultantHours: number | null;
    contractStartDate: Date | null;
    contractEndDate: Date | null;
    contractRollover: boolean | null;
    salesContact: number | null;
    isCompleted: boolean;
    isUk: boolean | null;
    isEu: boolean | null;
    lastStepCompleted: number;
}

export interface ClientAccountInput
    extends Optional<
        ClientAccountAttributes,
        | 'id'
        | 'uuid'
        | 'subscriptionSeats'
        | 'contractStartDate'
        | 'contractEndDate'
        | 'contractRollover'
    > {}

export interface ClientAccountOutput
    extends Required<ClientAccountAttributes> {}

export class ClientAccount
    extends Model<ClientAccountAttributes, ClientAccountInput>
    implements ClientAccountAttributes, ClientAccountOutput
{
    public id!: number;
    public uuid!: string;
    public subscriptionSeats!: number;
    public name!: string;
    public notes!: string | null;
    public contactName!: string;
    public contactEmailAddress!: string;
    public contactTelephoneNumber!: string;

    public consultantHours!: number | null;
    public contractStartDate!: Date | null;
    public contractEndDate!: Date | null;
    public contractRollover!: boolean | null;
    public isCompleted!: boolean;
    public isUk!: boolean | null;
    public isEu!: boolean | null;
    public lastStepCompleted!: number;

    // mixins for association (optional)
    public subscription!: number | null;
    public readonly subscriptionType!: SubscriptionType;
    public getSubscriptionType!: BelongsToGetAssociationMixin<SubscriptionType>;
    public setSubscriptionType!: BelongsToSetAssociationMixin<
        SubscriptionType,
        number
    >;
    public createSubscriptionType!: BelongsToCreateAssociationMixin<SubscriptionType>;

    // mixins for association (optional)
    public salesContact!: number | null;
    public readonly salesContactUser!: User;
    public getSalesContactUser!: BelongsToGetAssociationMixin<User>;
    public setSalesContactUser!: BelongsToSetAssociationMixin<User, number>;
    public createSalesContactUser!: BelongsToCreateAssociationMixin<User>;

    public static associations: {
        subscriptionType: Association<ClientAccount, SubscriptionType>;
        salesContactUser: Association<ClientAccount, User>;
    };

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

ClientAccount.init(
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
        subscription: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'dods_subscription_types',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        subscriptionSeats: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },
        contactName: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        contactEmailAddress: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        contactTelephoneNumber: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        consultantHours: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: true,
            defaultValue: true,
        },
        contractStartDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
        contractEndDate: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
        contractRollover: {
            type: DataTypes.TINYINT({ length: 1 }),
            allowNull: true,
            defaultValue: null,
        },
        salesContact: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'dods_users',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        isCompleted: {
            type: DataTypes.TINYINT({ length: 1 }),
            allowNull: false,
            defaultValue: 0,
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
        lastStepCompleted: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: false,
            defaultValue: 1,
        },
    },
    {
        tableName: 'dods_client_accounts',
        underscored: true,
        timestamps: true,
        sequelize: sequelizeConnection,
        // paranoid: true
    }
);

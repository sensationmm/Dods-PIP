import { BelongsTo, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';
import { SubscriptionType, User } from './';

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
  contractStartDate: Date | null;
  contractEndDate: Date | null;
  contractRollover: boolean | null;
  salesContact: number | null;
  isCompleted: boolean;
  lastStepCompleted: number;
}

export interface ClientAccountInput
  extends Optional<ClientAccountAttributes, 'id' | 'uuid' | 'subscriptionSeats' | 'contractStartDate' | 'contractEndDate' | 'contractRollover'> { }

export interface ClientAccountOutput extends Required<ClientAccountAttributes> { }

export class ClientAccount extends Model<ClientAccountAttributes, ClientAccountInput> implements ClientAccountAttributes {
  public id!: number;
  public uuid!: string;
  public subscriptionSeats!: number;
  public name!: string;
  public notes!: string | null;
  public contactName!: string;
  public contactEmailAddress!: string;
  public contactTelephoneNumber!: string;
  public contractStartDate!: Date | null;
  public contractEndDate!: Date | null;
  public contractRollover!: boolean | null;
  public isCompleted!: boolean;
  public lastStepCompleted!: number;

  // mixins for association (optional)
  public subscription!: number | null;
  public readonly subscriptionModel!: SubscriptionType;
  public getSubscription!: BelongsToGetAssociationMixin<SubscriptionType>;
  public setSubscription!: BelongsToSetAssociationMixin<SubscriptionType, number>;
  public createSubscription!: BelongsToCreateAssociationMixin<SubscriptionType>;

  // mixins for association (optional)
  public salesContact!: number | null;
  public readonly salesContactModel!: User;
  public getSalesContact!: BelongsToGetAssociationMixin<SubscriptionType>;
  public setSalesContact!: BelongsToSetAssociationMixin<SubscriptionType, number>;
  public createSalesContact!: BelongsToCreateAssociationMixin<SubscriptionType>;

  public static associations: {
    subscriptionModel: BelongsTo<ClientAccount, SubscriptionType>,
    salesContactModel: BelongsTo<ClientAccount, User>
  };

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

ClientAccount.init({
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
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
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
    defaultValue: null
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
  contractStartDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  contractEndDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  },
  contractRollover: {
    type: DataTypes.TINYINT({ length: 1 }),
    allowNull: true,
    defaultValue: null
  },
  salesContact: {
    type: DataTypes.INTEGER({ length: 11 }),
    allowNull: true,
    defaultValue: null,
    references: {
      model: 'dods_users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  isCompleted: {
    type: DataTypes.TINYINT({ length: 1 }),
    allowNull: false,
    defaultValue: 0
  },
  lastStepCompleted: {
    type: DataTypes.INTEGER({ length: 11 }),
    allowNull: false,
    defaultValue: 4
  }
}, {
  tableName: 'dods_client_accounts',
  underscored: true,
  timestamps: true,
  sequelize: sequelizeConnection,
  // paranoid: true
});

import { BelongsTo, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';
import { ClientAccount } from '.';

interface ClientAccountTagAttributes {
  id: number;
  uuid: string;
  clientAccountId: number;
  tagType: number;
  tagId: string;
  tagText: string;
}

export interface ClientAccountTagInput extends Optional<ClientAccountTagAttributes, 'id' | 'uuid'> { }

export interface ClientAccountTagOutput extends Required<ClientAccountTagAttributes> { }

export class ClientAccountTag extends Model<ClientAccountTagAttributes, ClientAccountTagInput> implements ClientAccountTagAttributes {
  public id!: number;
  public uuid!: string;
  public tagType!: number;
  public tagId!: string;
  public tagText!: string;

  // mixins for association (optional)
  public clientAccountId!: number;
  public readonly clientAccount!: ClientAccount;
  public getClientAccount!: BelongsToGetAssociationMixin<ClientAccount>;
  public setClientAccount!: BelongsToSetAssociationMixin<ClientAccount, number>;
  public createClientAccount!: BelongsToCreateAssociationMixin<ClientAccount>;

  public static associations: {
    clientAccount: BelongsTo<ClientAccountTag, ClientAccount>
  };

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

ClientAccountTag.init({
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
  tagType: {
    type: DataTypes.INTEGER({ length: 11 }),
    allowNull: false,
  },
  tagId: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tagText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'dods_client_account_tags',
  underscored: true,
  timestamps: true,
  sequelize: sequelizeConnection,
  // paranoid: true
});

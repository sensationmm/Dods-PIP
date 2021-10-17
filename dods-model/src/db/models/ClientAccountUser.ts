import { Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';
import { User, ClientAccount } from '.';

interface ClientAccountUserAttributes {
    clientAccountId: number;
    userId: number | null;
    userType: number;
}

export interface ClientAccountUserInput extends Optional<ClientAccountUserAttributes, 'userId'> { }

export interface ClientAccountUserOutput extends Required<ClientAccountUserAttributes> { }

export class ClientAccountUser extends Model<ClientAccountUserAttributes, ClientAccountUserInput> implements ClientAccountUserAttributes {
    public clientAccountId!: number;
    public userId!: number | null;
    public userType!: number;

    // mixins for association (optional)
    public readonly clientAccounts!: ClientAccountUser[]; // Note this is optional since it's only populated when explicitly requested in code
    public getClientAccount!: HasManyGetAssociationsMixin<ClientAccount>; // Note the null assertions!
    public addClientAccount!: HasManyAddAssociationMixin<ClientAccount, number>;
    public hasClientAccount!: HasManyHasAssociationMixin<ClientAccount, number>;
    public countClientAccount!: HasManyCountAssociationsMixin;
    public createClientAccount!: HasManyCreateAssociationMixin<ClientAccount>;


    // mixins for association (optional)
    public readonly users!: User[]; // Note this is optional since it's only populated when explicitly requested in code
    public getUser!: HasManyGetAssociationsMixin<User>; // Note the null assertions!
    public addUser!: HasManyAddAssociationMixin<User, number>;
    public hasUser!: HasManyHasAssociationMixin<User, number>;
    public countUser!: HasManyCountAssociationsMixin;
    public createUser!: HasManyCreateAssociationMixin<User>;

    public static associations: {
        clientAccounts: Association<ClientAccountUser, ClientAccount>,
        users: Association<ClientAccountUser, User>
    };

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

ClientAccountUser.init({
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
    userId: {
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
    userType: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
    },
}, {
    tableName: 'dods_client_account_users',
    underscored: true,
    timestamps: true,
    sequelize: sequelizeConnection,
    // paranoid: true
});

import { Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';
import { User, ClientAccount } from '.';

interface ClientAccountTeamAttributes {
    clientAccountId: number;
    userId?: number | null;
    teamMemberType: number;
    parsedType?: string;
}

export interface ClientAccountTeamInput extends Optional<ClientAccountTeamAttributes, 'userId'> { }

export interface ClientAccountTeamOutput extends Required<ClientAccountTeamAttributes> { }

export class ClientAccountTeam extends Model<ClientAccountTeamAttributes, ClientAccountTeamInput> implements ClientAccountTeamAttributes {
    public clientAccountId!: number;
    public userId!: number | null;
    public teamMemberType!: number;

    public parsedType!: 'consultant' | 'client';

    // mixins for association (optional)
    public readonly clientAccounts?: ClientAccountTeam[]; // Note this is optional since it's only populated when explicitly requested in code
    public getClientAccount!: HasManyGetAssociationsMixin<ClientAccount>; // Note the null assertions!
    public addClientAccount!: HasManyAddAssociationMixin<ClientAccount, number>;
    public hasClientAccount!: HasManyHasAssociationMixin<ClientAccount, number>;
    public countClientAccount!: HasManyCountAssociationsMixin;
    public createClientAccount!: HasManyCreateAssociationMixin<ClientAccount>;


    // mixins for association (optional)
    public readonly users?: User[]; // Note this is optional since it's only populated when explicitly requested in code
    public getUser!: HasManyGetAssociationsMixin<User>; // Note the null assertions!
    public addUser!: HasManyAddAssociationMixin<User, number>;
    public hasUser!: HasManyHasAssociationMixin<User, number>;
    public countUser!: HasManyCountAssociationsMixin;
    public createUser!: HasManyCreateAssociationMixin<User>;

    public static associations: {
        clientAccounts: Association<ClientAccountTeam, ClientAccount>,
        users: Association<ClientAccountTeam, User>
    };

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

ClientAccountTeam.init({
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
    teamMemberType: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
    },
    parsedType: {
        type: DataTypes.VIRTUAL(DataTypes.STRING, ['teamMemberType']),
        get() {
            switch (this.teamMemberType) {
                case 1:
                    return 'consultant';
                case 2:
                    return 'client';
                default:
                    return 'Invalid Type';
            }
        },
        set(_value) {
            throw new Error('Do not try to set the `parsedType` value!');
        },
    },
}, {
    tableName: 'dods_client_account_teams',
    underscored: true,
    timestamps: true,
    sequelize: sequelizeConnection,
    // paranoid: true
});

ClientAccountTeam.hasMany(User, { sourceKey: 'id', foreignKey: 'userId' });
ClientAccountTeam.hasMany(ClientAccount, { sourceKey: 'id', foreignKey: 'clientAccountId' });
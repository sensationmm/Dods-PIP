import {
    BelongsTo,
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    BelongsToMany,
    BelongsToManyAddAssociationMixin,
    BelongsToManyGetAssociationsMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    Model,
    Optional,
} from 'sequelize';
import { ClientAccount, ClientAccountTeam, Role } from '.';

import { Sequelize } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';

export interface UserAttributes {
    id: number;
    uuid: string;
    roleId: number | null;
    firstName: string;
    lastName: string;
    title: string | null;
    primaryEmail: string;
    secondaryEmail: string | null;
    telephoneNumber1: string | null;
    telephoneNumber2: string | null;
    fullName: string;
    isActive: boolean;
    memberSince: Date;
}

export interface UserInput
    extends Optional<
        UserAttributes,
        | 'id'
        | 'uuid'
        | 'secondaryEmail'
        | 'telephoneNumber1'
        | 'telephoneNumber2'
        | 'fullName'
    > {}

export interface UserOutput extends Required<UserAttributes> {}

export class User
    extends Model<UserAttributes, UserInput>
    implements UserAttributes
{
    public id!: number;
    public uuid!: string;
    public firstName!: string;
    public lastName!: string;
    public title!: string | null;
    public primaryEmail!: string;
    public secondaryEmail!: string | null;
    public telephoneNumber1!: string | null;
    public telephoneNumber2!: string | null;
    public isActive!: boolean;
    public memberSince!: Date;

    public fullName!: string;

    // mixins for association (optional)
    public roleId!: number | null;
    public readonly role!: Role;
    public getRole!: BelongsToGetAssociationMixin<Role>;
    public setRole!: BelongsToSetAssociationMixin<Role, number>;
    public createRole!: BelongsToCreateAssociationMixin<Role>;

    // mixins for association (optional)
    public readonly accounts?: ClientAccount[];
    public getAccounts!: BelongsToManyGetAssociationsMixin<ClientAccount>;
    public addAccount!: BelongsToManyAddAssociationMixin<ClientAccount, number>;

    public ClientAccountTeam?: ClientAccountTeam;

    public static associations: {
        role: BelongsTo<User, Role>;
        accounts: BelongsToMany<User, ClientAccount>;
    };

    //Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

User.init(
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
        roleId: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'dods_roles',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        firstName: {
            type: DataTypes.STRING({ length: 50 }),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING({ length: 50 }),
            allowNull: false,
        },
        fullName: {
            type: DataTypes.VIRTUAL(DataTypes.STRING, [
                'firstName',
                'lastName',
            ]),
            get() {
                return `${this.firstName} ${this.lastName}`;
            },
            set(_value) {
                throw new Error('Do not try to set the `fullName` value!');
            },
        },
        title: {
            type: DataTypes.STRING({ length: 150 }),
            allowNull: true,
        },
        primaryEmail: {
            type: DataTypes.STRING({ length: 100 }),
            allowNull: false,
        },
        secondaryEmail: {
            type: DataTypes.STRING({ length: 100 }),
            allowNull: true,
            defaultValue: null,
        },
        telephoneNumber1: {
            type: DataTypes.STRING({ length: 20 }),
            allowNull: true,
            defaultValue: null,
            field: 'telephone_number_1',
        },
        telephoneNumber2: {
            type: DataTypes.STRING({ length: 20 }),
            allowNull: true,
            defaultValue: null,
            field: 'telephone_number_2',
        },

        isActive: {
            type: DataTypes.TINYINT({ length: 1 }),
            allowNull: false,
            defaultValue: 1,
        },
        memberSince: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
    },
    {
        tableName: 'dods_users',
        underscored: true,
        timestamps: true,
        sequelize: sequelizeConnection,
        // paranoid: true
    }
);

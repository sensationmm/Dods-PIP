import { BelongsTo, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';
import { Role } from '.';

export interface UserAttributes {
    id: number;
    uuid: string;
    roleId: number | null;
    firstName: string;
    lastName: string;
    title: string;
    primaryEmail: string;
    secondaryEmail: string | null;
    telephoneNumber1: string | null;
    telephoneNumber2: string | null;
    fullName: string;
}

export interface UserInput extends Optional<UserAttributes, 'id' | 'uuid' | 'secondaryEmail' | 'telephoneNumber1' | 'telephoneNumber2' | 'fullName'> { }

export interface UserOutput extends Required<UserAttributes> { }

export class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: number;
    public uuid!: string;
    public firstName!: string;
    public lastName!: string;
    public title!: string;
    public primaryEmail!: string;
    public secondaryEmail!: string | null;
    public telephoneNumber1!: string;
    public telephoneNumber2!: string;

    public fullName!: string;

    // mixins for association (optional)
    public roleId!: number | null;
    public readonly roleModel!: Role;
    public getRole!: BelongsToGetAssociationMixin<Role>;
    public setRole!: BelongsToSetAssociationMixin<Role, number>;
    public createRole!: BelongsToCreateAssociationMixin<Role>;

    public static associations: {
        roleModel: BelongsTo<User, Role>
    };

    //Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

User.init({
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
            key: 'id'
        },
        onUpdate: 'CASCADE'
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
        type: DataTypes.VIRTUAL(DataTypes.STRING, ['firstName', 'lastName']),
        get() {
            return `${this.firstName} ${this.lastName}`;
        },
        set(_value) {
            throw new Error('Do not try to set the `fullName` value!');
        },
    },
    title: {
        type: DataTypes.STRING({ length: 150 }),
        allowNull: false,
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
        field: 'telephone_number_1'
    },
    telephoneNumber2: {
        type: DataTypes.STRING({ length: 20 }),
        allowNull: true,
        defaultValue: null,
        field: 'telephone_number_2'
    }
}, {
    tableName: 'dods_users',
    underscored: true,
    timestamps: true,
    sequelize: sequelizeConnection,
    // paranoid: true
});

User.belongsTo(Role, { targetKey: "id", foreignKey: 'roleId' });
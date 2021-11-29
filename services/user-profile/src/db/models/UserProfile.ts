import {
    BelongsToSetAssociationMixin,
    DataTypes,
    Model,
    Optional,
} from '@dodsgroup/dods-model';

import RoleTypeModel from './RoleType';
import sequelize from '../sequelize';

export interface UserProfileModelAttributes {
    id: number;
    uuid: string;
    firstName: string;
    lastName: string;
    title: string;
    primaryEmail: string;
    secondaryEmail?: string;
    telephoneNumber1?: string;
    telephoneNumber2?: string;
    fullName: string;
    role?: RoleTypeModel;
}

export interface UserProfileModelCreationAttributes
    extends Optional<
        UserProfileModelAttributes,
        | 'id'
        | 'uuid'
        | 'secondaryEmail'
        | 'telephoneNumber1'
        | 'telephoneNumber2'
        | 'fullName'
    > {}

class UserProfileModel
    extends Model<
        UserProfileModelAttributes,
        UserProfileModelCreationAttributes
    >
    implements UserProfileModelAttributes
{
    public id!: number;
    public uuid!: string;
    public firstName!: string;
    public lastName!: string;
    public title!: string;
    public primaryEmail!: string;
    public secondaryEmail?: string;
    public telephoneNumber1!: string;
    public telephoneNumber2?: string;

    public fullName!: string;
    public role?: RoleTypeModel;

    public setRole!: BelongsToSetAssociationMixin<RoleTypeModel, number>;

    //Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

UserProfileModel.init(
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
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: 'null',
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: 'null',
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
            type: DataTypes.STRING(150),
            allowNull: false,
            comment: 'null',
        },
        primaryEmail: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'null',
        },
        secondaryEmail: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'null',
        },
        telephoneNumber1: {
            type: DataTypes.STRING(20),
            allowNull: false,
            comment: 'null',
            field: 'telephone_number_1',
        },
        telephoneNumber2: {
            type: DataTypes.STRING(20),
            allowNull: false,
            comment: 'null',
            field: 'telephone_number_2',
        },
    },
    {
        underscored: true,
        tableName: 'dods_users',
        sequelize,
    }
);

export default UserProfileModel;

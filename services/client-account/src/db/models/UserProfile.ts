import {
    Association,
    BelongsToCreateAssociationMixin,
    BelongsToGetAssociationMixin,
    DataTypes,
    Model,
} from 'sequelize';
import {
    UserProfileModelAttributes,
} from '../types';

import sequelize from '../sequelize';

class UserProfileModel
    extends Model<UserProfileModelAttributes>
    implements UserProfileModelAttributes
{
    public id!: number;
    public uuid!: string;
    public roleId!:number;
    public firstName!:string;
    public lastName!:string;
    public title!:string;
    public primaryEmail!:string;
    public secondaryEmail!:string;
    public telephoneNumber_1!:string;
    public telephoneNumber_2!:string;
    
    public fullName?:string;

    //Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;

    //Model Associations
    //public getSubscription!: BelongsToGetAssociationMixin<SubscriptionType>;
    //public setSubscription!: BelongsToCreateAssociationMixin<SubscriptionType>;

    // public static associations: {
    //     subscription: Association<ClientAccountModel, SubscriptionType>;
    // };
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
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.firstName} ${this.lastName}`;
            },
            set(_value) {
                throw new Error('Do not try to set the `fullName` value!');
            }
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
        telephoneNumber_1: {
            type: DataTypes.STRING(20),
            allowNull: false,
            comment: 'null',
        },
        telephoneNumber_2: {
            type: DataTypes.STRING(20),
            allowNull: false,
            comment: 'null',
        },
        
    },
    {
        underscored: true,
        tableName: 'dods_users',
        sequelize,
    }
);

export default UserProfileModel;

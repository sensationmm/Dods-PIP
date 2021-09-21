import { DataTypes, Model, Optional } from 'sequelize';

import sequelize from '../sequelize';

interface SubscriptionTypeAttributes {
    id: number;
    uuid: string;
    name: string;
    location: number;
    contentType: number;
}

interface SubscriptionTypeCreationAttributes
    extends Optional<SubscriptionTypeAttributes, 'id' | 'uuid'> {}

class SubscriptionType
    extends Model<
        SubscriptionTypeAttributes,
        SubscriptionTypeCreationAttributes
    >
    implements SubscriptionTypeAttributes
{
    public id!: number;
    public uuid!: string;
    public name!: string;
    public location!: number;
    public contentType!: number;

    //Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

SubscriptionType.init(
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
        location: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'null',
        },
        contentType: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'null',
        },
    },
    {
        underscored: true,
        tableName: 'dods_subscription_types',
        sequelize,
    }
);

export default SubscriptionType;

import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';

interface SubscriptionTypeAttributes {
    id: number;
    uuid: string;
    name: string;
    location: number;
    contentType: number;
}

export interface SubscriptionTypeInput extends Optional<SubscriptionTypeAttributes, 'id' | 'uuid'> { }

export interface SubscriptionTypetOutput extends Required<SubscriptionTypeAttributes> { }

export class SubscriptionType extends Model<SubscriptionTypeAttributes, SubscriptionTypeInput> implements SubscriptionTypeAttributes {
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

SubscriptionType.init({
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
}, {
    tableName: 'dods_subscription_types',
    underscored: true,
    timestamps: true,
    sequelize: sequelizeConnection,
    // paranoid: true
});

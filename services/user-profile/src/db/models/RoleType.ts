import { DataTypes, Model, Optional } from '@dodsgroup/dods-model';

import sequelize from '../sequelize';

export interface RoleTypeAttributes {
    id: number;
    uuid: string;
    title: string;
    dodsRole: boolean;
}

interface RoleTypeCreationAttributes
    extends Optional<RoleTypeAttributes, 'id' | 'uuid'> {}

class RoleTypeModel
    extends Model<RoleTypeAttributes, RoleTypeCreationAttributes>
    implements RoleTypeAttributes
{
    public id!: number;
    public uuid!: string;
    public title!: string;
    public dodsRole!: boolean;

    //Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

RoleTypeModel.init(
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
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
            comment: 'null',
        },
        dodsRole: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            comment: 'null',
        },
    },
    {
        underscored: true,
        tableName: 'dods_roles',
        sequelize,
    }
);

export default RoleTypeModel;

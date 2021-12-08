import { DataTypes, Model, Optional } from 'sequelize';

import sequelize from '../sequelize';

export interface RoleAttributes {
    id: number;
    uuid: string;
    title: string;
    dodsRole: boolean;
}

export interface RoleInput extends Optional<RoleAttributes, 'id' | 'uuid'> {}

export interface RoleOutput extends Required<RoleAttributes> {}

class Role extends Model<RoleAttributes, RoleInput> implements RoleAttributes {
    public id!: number;
    public uuid!: string;
    public title!: string;
    public dodsRole!: boolean;

    //Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

Role.init(
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
        title: {
            type: DataTypes.STRING({ length: 45 }),
            allowNull: false,
        },
        dodsRole: {
            type: DataTypes.TINYINT({ length: 1 }),
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: 'dods_roles',
        underscored: true,
        timestamps: true,
        sequelize,
        // paranoid: true
    }
);
export default Role;

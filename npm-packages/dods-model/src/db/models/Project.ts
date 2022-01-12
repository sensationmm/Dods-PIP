import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';

export interface ProjectAttributes {
    id: number;
    uuid: string;
    title: string;
}

export interface ProjectInput extends Optional<ProjectAttributes, 'id' | 'uuid'> { }

export interface ProjectOutput extends Required<ProjectAttributes> { }

export class Project extends Model<ProjectAttributes, ProjectInput> implements ProjectAttributes {
    public id!: number;
    public uuid!: string;
    public title!: string;

    //Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

Project.init({
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
        type: DataTypes.STRING({ length: 100 }),
        allowNull: false,
    },
}, {
    tableName: 'dods_projects',
    underscored: true,
    timestamps: true,
    sequelize: sequelizeConnection,
    // paranoid: true
});

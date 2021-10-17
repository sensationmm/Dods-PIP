import { Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';
import { User, Project } from '.';

interface ProjectUserAttributes {
    projectId: number;
    userId: number;
    projectRole: number;
}

export interface ProjectUserInput extends Optional<ProjectUserAttributes, 'userId'> { }

export interface ProjectUserOutput extends Required<ProjectUserAttributes> { }

export class ProjectUser extends Model<ProjectUserAttributes, ProjectUserInput> implements ProjectUserAttributes {
    public projectId!: number;
    public userId!: number;
    public projectRole!: number;

    // mixins for association (optional)
    public readonly projects!: Project[]; // Note this is optional since it's only populated when explicitly requested in code
    public getProjects!: HasManyGetAssociationsMixin<Project>; // Note the null assertions!
    public addProject!: HasManyAddAssociationMixin<Project, number>;
    public hasProject!: HasManyHasAssociationMixin<Project, number>;
    public countProjects!: HasManyCountAssociationsMixin;
    public createProject!: HasManyCreateAssociationMixin<Project>;


    // mixins for association (optional)
    public readonly users!: User[]; // Note this is optional since it's only populated when explicitly requested in code
    public getUsers!: HasManyGetAssociationsMixin<User>; // Note the null assertions!
    public addUser!: HasManyAddAssociationMixin<User, number>;
    public hasUser!: HasManyHasAssociationMixin<User, number>;
    public countUsers!: HasManyCountAssociationsMixin;
    public createUser!: HasManyCreateAssociationMixin<User>;

    public static associations: {
        projects: Association<ProjectUser, Project>,
        users: Association<ProjectUser, User>
    };

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

ProjectUser.init({
    projectId: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        references: {
            model: 'dods_projects',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    userId: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        references: {
            model: 'dods_users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    projectRole: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
    },
}, {
    tableName: 'dods_project_users',
    underscored: true,
    timestamps: true,
    sequelize: sequelizeConnection,
    // paranoid: true
});

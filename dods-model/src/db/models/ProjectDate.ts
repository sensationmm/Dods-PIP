import { BelongsTo, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';
import { Project } from '.';

interface ProjectDateAttributes {
  id: number;
  uuid: string;
  projectId: number;
  title: string;
  date: Date;
}

export interface ProjectDateInput extends Optional<ProjectDateAttributes, 'id' | 'uuid'> { }

export interface ProjectDateOutput extends Required<ProjectDateAttributes> { }

export class ProjectDate extends Model<ProjectDateAttributes, ProjectDateInput> implements ProjectDateAttributes {
  public id!: number;
  public uuid!: string;
  public title!: string;
  public date!: Date;

  // mixins for association (optional)
  public projectId!: number;
  public readonly project!: Project;
  public getProject!: BelongsToGetAssociationMixin<Project>;
  public setProject!: BelongsToSetAssociationMixin<Project, number>;
  public createProject!: BelongsToCreateAssociationMixin<Project>;

  public static associations: {
    project: BelongsTo<ProjectDate, Project>
  };

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

ProjectDate.init({
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
  title: {
    type: DataTypes.STRING({ length: 150 }),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'dods_project_dates',
  underscored: true,
  timestamps: true,
  sequelize: sequelizeConnection,
  // paranoid: true
});

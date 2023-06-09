import { BelongsTo, BelongsToCreateAssociationMixin, BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../config/sequelizeConnection';
import { User } from '.';

export interface TaskAttributes {
    id: number;
    uuid: string;
    description: string;
    status: number;
    assignedTo: number | null;
    dueAt: Date;
    completedAt: Date;
    createdBy: number;
}

export interface TaskInput extends Optional<TaskAttributes, 'id' | 'uuid'> { }

export interface TaskOutput extends Required<TaskAttributes> { }

export class Task extends Model<TaskAttributes, TaskInput> implements TaskAttributes {
    public id!: number;
    public uuid!: string;
    public description!: string;
    public status!: number;

    public dueAt!: Date;
    public completedAt!: Date;

    // mixins for association (optional)
    public assignedTo!: number | null;
    public readonly assignedToUser!: User;
    public getAssignedToUser!: BelongsToGetAssociationMixin<User>;
    public setAssignedToUser!: BelongsToSetAssociationMixin<User, number>;
    public createAssignedToUser!: BelongsToCreateAssociationMixin<User>;

    // mixins for association (optional)
    public createdBy!: number;
    public readonly createdByUser!: User;
    public getCreatedByUser!: BelongsToGetAssociationMixin<User>;
    public setCreatedByUser!: BelongsToSetAssociationMixin<User, number>;
    public createCreatedByUser!: BelongsToCreateAssociationMixin<User>;

    public static associations: {
        assignedToUser: BelongsTo<Task, User>,
        createdByUser: BelongsTo<Task, User>
    };

    //Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

Task.init({
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
    description: {
        type: DataTypes.STRING({ length: 200 }),
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
    },
    assignedTo: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: true,
        defaultValue: null,
        references: {
            model: 'dods_users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    dueAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    completedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.INTEGER({ length: 11 }),
        allowNull: false,
        references: {
            model: 'dods_users',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
}, {
    tableName: 'dods_tasks',
    underscored: true,
    timestamps: true,
    sequelize: sequelizeConnection,
    // paranoid: true
});

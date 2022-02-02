import {
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    Model,
    Optional,
} from 'sequelize';
import { EditorialRecordStatus, User } from '.';

import sequelizeConnection from '../config/sequelizeConnection';

export interface EditorialRecordAttributes {
    uuid: string;
    documentName: string;
    s3Location: string;
    informationType?: string;
    contentSource?: string;
    assignedEditor?: User;
    status?: EditorialRecordStatus;
    isPublished?: boolean;
    isArchived?: boolean;
    assignedEditorId?: number | null;
}

export interface EditorialRecordInput
    extends Optional<
    EditorialRecordAttributes,
    'uuid' | 'informationType' | 'contentSource' | 'assignedEditor' | 'status' | 'isPublished' | 'isArchived'
    > { }

export interface EditorialRecordOutput extends Required<EditorialRecordAttributes> { }

export class EditorialRecord
    extends Model<EditorialRecordAttributes, EditorialRecordInput>
    implements EditorialRecordAttributes {
    public uuid!: string;
    public documentName!: string;
    public s3Location!: string;
    public informationType?: string;
    public contentSource?: string;
    public isPublished?: boolean;
    public isArchived?: boolean;

    // mixins for association (optional)
    public assignedEditor?: User;
    public getAssignedEditor!: BelongsToGetAssociationMixin<User>;
    public setAssignedEditor!: BelongsToSetAssociationMixin<User, number>;

    public status?: EditorialRecordStatus;
    public getStatus!: BelongsToGetAssociationMixin<EditorialRecordStatus>;
    public setStatus!: BelongsToSetAssociationMixin<EditorialRecordStatus, number>;

    //Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

EditorialRecord.init(
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        documentName: {
            type: DataTypes.STRING({ length: 100 }),
            allowNull: false,
        },
        s3Location: {
            type: DataTypes.STRING({ length: 200 }),
            allowNull: false,
        },
        informationType: {
            type: DataTypes.STRING({ length: 100 }),
            allowNull: true,
        },
        contentSource: {
            type: DataTypes.STRING({ length: 100 }),
            allowNull: true,
        },
        isPublished: {
            type: DataTypes.TINYINT({ length: 1 }),
            allowNull: false,
            defaultValue: false,
        },
        isArchived: {
            type: DataTypes.TINYINT({ length: 1 }),
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: 'dods_editorial_records',
        underscored: true,
        timestamps: true,
        sequelize: sequelizeConnection,
        paranoid: true
    }
);

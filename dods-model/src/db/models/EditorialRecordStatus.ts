import { DataTypes, Model, Optional } from 'sequelize';

import sequelizeConnection from '../config/sequelizeConnection';

export interface EditorialRecordStatusAttributes {
    uuid: string;
    status: string;
}

export interface EditorialRecordStatusInput
    extends Optional<EditorialRecordStatusAttributes, 'uuid'> {}

export interface EditorialRecordStatusOutput extends Required<EditorialRecordStatusAttributes> {}

export class EditorialRecordStatus
    extends Model<EditorialRecordStatusAttributes, EditorialRecordStatusInput>
    implements EditorialRecordStatusAttributes
{
    public uuid!: string;
    public status!: string;

    //Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

EditorialRecordStatus.init(
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING({ length: 20 }),
            allowNull: false,
        },
    },
    {
        tableName: 'dods_editorial_record_statuses',
        underscored: true,
        timestamps: true,
        sequelize: sequelizeConnection,
        // paranoid: true
    }
);

import { DataTypes, Model, Optional } from 'sequelize';

import sequelizeConnection from '../config/sequelizeConnection';

export interface AlertTemplateAttributes {
    id: number;
    name: string;
    isActive: boolean;
}

export interface AlertTemplateInput
    extends Optional<AlertTemplateAttributes, 'id'> {}

export interface AlertTemplateOutput extends Required<AlertTemplateAttributes> {}

export class AlertTemplate
    extends Model<AlertTemplateAttributes, AlertTemplateInput>
    implements AlertTemplateAttributes
{
    public id!: number;
    public name!: string;
    public isActive!: boolean;

    //Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

AlertTemplate.init(
    {
        id: {
            type: DataTypes.INTEGER({ length: 11 }),
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
            name: {
            type: DataTypes.STRING({ length: 255 }),
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
            allowNull: true,
        },
    },
    {
        tableName: 'dods_collections_alert_templates',
        underscored: true,
        timestamps: true,
        sequelize: sequelizeConnection,
        // paranoid: true
    }
);

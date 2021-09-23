import { DataTypes, Model, Optional } from 'sequelize';

import sequelize from '../sequelize';

interface ClientAccountTeamAttributes {
    clientAccountId: number;
    userId?: number | null;
    teamMemberType: number;
}

interface ClientAccountTeamCreationAttributes extends Optional<ClientAccountTeamAttributes, 'userId'> {}

class ClientAccountTeam extends Model<ClientAccountTeamAttributes, ClientAccountTeamCreationAttributes>
    implements ClientAccountTeamAttributes
{
    public clientAccountId!: number;
    public userId?: number | null;
    public teamMemberType!: number;

    //Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

ClientAccountTeam.init(
    {
        clientAccountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'null',
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'null',
        },
        teamMemberType: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'null',
        },
    },
    {
        underscored: true,
        tableName: 'dods_client_account_teams',
        sequelize,
    }
);

export default ClientAccountTeam;

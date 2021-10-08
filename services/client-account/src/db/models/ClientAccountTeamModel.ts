import { Association, DataTypes, Model, Optional } from 'sequelize';

import { ClientAccountTeam } from '../../domain/interfaces/ClientAccountTeam';
import { UserProfileModel } from '.';
import sequelize from '../sequelize';

interface ClientAccountTeamAttributes {
    clientAccountId: number;
    userId?: number | null;
    teamMemberType: number;
    parsedType?: string;
}

interface ClientAccountTeamCreationAttributes
    extends Optional<ClientAccountTeamAttributes, 'userId'> {}

class ClientAccountTeamModel
    extends Model<
        ClientAccountTeamAttributes,
        ClientAccountTeamCreationAttributes
    >
    implements ClientAccountTeam, ClientAccountTeamAttributes
{
    public clientAccountId!: number;
    public userId?: number;
    public teamMemberType!: number;

    public UserProfileModels?: UserProfileModel[];

    public parsedType!: 'consultant' | 'client';

    //Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;

    public static associations: {
        user: Association<ClientAccountTeamModel, UserProfileModel>;
    };
}

ClientAccountTeamModel.init(
    {
        clientAccountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'null',
            primaryKey: true,
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
        parsedType: {
            type: DataTypes.VIRTUAL(DataTypes.STRING, ['teamMemberType']),
            get() {
                switch (this.teamMemberType) {
                    case 1:
                        return 'consultant';
                    case 2:
                        return 'client';
                    default:
                        return 'Invalid Type';
                }
            },
            set(_value) {
                throw new Error('Do not try to set the `parsedType` value!');
            },
        },
    },
    {
        underscored: true,
        tableName: 'dods_client_account_teams',
        sequelize,
    }
);

export default ClientAccountTeamModel;

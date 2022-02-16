import { ClientAccount, Role, SubscriptionType, User, UserOutput } from '@dodsgroup/dods-model';
import {
    ClientAccountObj,
    CreateUserPersisterInput,
    CreateUserPersisterOutput,
    GetUserClientAccounts,
    GetUserInput,
    GetUserOutput,
    SearchUsersInput,
    SearchUsersOutput,
    UpdateUserPersisterInput,
    UserAccountsReponse,
    UserProfileError,
    UserProfilePersisterV2,
} from '../domain';
import { Op, WhereOptions } from 'sequelize';

export const LAST_NAME_COLUMN = 'lastName';
export const ROLE_ID_COLUMN = 'roleId';
export const ASC = 'ASC';
export const DODS_USER = '83618280-9c84-441c-94d1-59e4b24cbe3d';
export const CLIENT_ACCOUNT_NAME = 'name';

export class UserProfileRepositoryV2 implements UserProfilePersisterV2 {
    static defaultInstance: UserProfilePersisterV2 = new UserProfileRepositoryV2();

    async getUser(parameters: GetUserInput): Promise<GetUserOutput> {
        const user = await User.findOne({
            where: { uuid: parameters.userId },
            include: [User.associations.role, User.associations.accounts],
        });

        if (!user) {
            throw new UserProfileError(`Error: UserUUID ${parameters.userId} does not exist`);
        }
        let clientAccount: ClientAccountObj = {
            uuid: undefined,
            name: undefined,
            teamMemberType: undefined,
        };
        if (user.accounts?.length) {
            clientAccount = {
                uuid: user.accounts[0].uuid,
                name: user.accounts[0].name,
                teamMemberType: user.accounts[0].ClientAccountTeam?.teamMemberType,
            };
            for (let i = 0; i < user.accounts.length; i++) {
                if (user.accounts[i].isDodsAccount) {
                    clientAccount = {
                        uuid: user.accounts[i].uuid,
                        name: user.accounts[i].name,
                        teamMemberType: user.accounts[i].ClientAccountTeam?.teamMemberType,
                    };
                }
            }
        }

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            primaryEmail: user.primaryEmail,
            secondaryEmail: user.secondaryEmail,
            telephoneNumber1: user.telephoneNumber1,
            telephoneNumber2: user.telephoneNumber2,
            title: user.title,
            isActive: user.isActive,
            memberSince: user.createdAt,

            role: {
                uuid: user.role.uuid,
                title: user.role.title,
                dodsRole: user.role.dodsRole,
            },
            clientAccountId: clientAccount ? clientAccount.uuid! : null,
            clientAccount: clientAccount,
            isDodsUser: user.role.uuid === DODS_USER,
        };
    }

    async searchUsers(parameters: SearchUsersInput): Promise<SearchUsersOutput> {
        const { name, startsWith, role, clientAccountId, limit, offset, sortBy, sortDirection, isActive } =
            parameters;

        let whereClause: any = {};

        if (name) {
            const fullName = name.split(/[ ]+/)

            if (fullName.length == 1) {
                whereClause = {
                    [Op.or]: [
                        { firstName: { [Op.like]: `%${name}%` } },
                        { lastName: { [Op.like]: `%${name}%` } },
                    ],
                };
            }
            else {
                whereClause = {
                    [Op.and]: [
                        { firstName: { [Op.like]: `%${fullName[0]}%` } },
                        { lastName: { [Op.like]: `%${fullName[1]}%` } },
                    ],
                };
            }

        }

        if (startsWith) {
            whereClause[LAST_NAME_COLUMN] = { [Op.like]: `${startsWith}%` };
        }

        if (role) {
            const roleRecord = await Role.findOne({ where: { uuid: role } });

            if (!roleRecord) {
                throw new UserProfileError(`Error: RoleUuid ${role} does not exist`);
            }

            whereClause[ROLE_ID_COLUMN] = roleRecord?.id;
        }

        if (clientAccountId) {
            whereClause['$accounts.uuid$'] = clientAccountId;
        }

        let orderBy: any = [sortBy, sortDirection];

        if (sortBy === 'role') {
            orderBy = [User.associations.role, 'title', sortDirection];
        } else if (sortBy === 'account') {
            orderBy = [User.associations.accounts, 'name', sortDirection];
        }

        if (isActive !== undefined) {
            if (isActive) {
                whereClause['is_active'] = true;
            }
            else {
                whereClause['is_active'] = false;
            }
        }


        const { rows, count } = await User.findAndCountAll({
            where: whereClause,
            distinct: true,
            subQuery: false,
            include: [User.associations.role, User.associations.accounts],
            order: [orderBy],
            offset: offset!,
            limit: limit!,
        });

        let users: any = [];

        rows.map(
            ({
                uuid,
                firstName,
                lastName,
                primaryEmail,
                secondaryEmail,
                telephoneNumber1,
                telephoneNumber2,
                title,
                role,
                accounts,
                isActive,
                createdAt,
            }) => {
                let clientAccount = {};

                if (accounts?.length) {
                    clientAccount = {
                        uuid: accounts[0].uuid,
                        name: accounts[0].name,
                    };
                    for (let i = 0; i < accounts.length; i++) {
                        if (accounts[i].isDodsAccount) {
                            clientAccount = {
                                uuid: accounts[i].uuid,
                                name: accounts[i].name,
                            };
                        }
                    }
                }

                users.push({
                    uuid,
                    firstName,
                    lastName,
                    title,
                    primaryEmail: primaryEmail,
                    secondaryEmail: secondaryEmail,
                    telephoneNumber1,
                    telephoneNumber2,
                    isActive: isActive,
                    memberSince: createdAt,
                    role: {
                        uuid: role.uuid,
                        title: role.title,
                        dodsRole: role.dodsRole,
                    },
                    clientAccount: clientAccount,
                    isDodsUser: role.uuid === DODS_USER,
                });
            }
        );

        return {
            users,
            count,
        };
    }

    async createUser(parameters: CreateUserPersisterInput): Promise<CreateUserPersisterOutput> {
        const {
            roleId,
            title,
            firstName,
            lastName,
            primaryEmail,
            secondaryEmail,
            telephoneNumber1,
            telephoneNumber2,
        } = parameters;

        const roleRecord = await Role.findOne({ where: { uuid: roleId } });

        if (!roleRecord) {
            throw new UserProfileError(`Error: Role uuid: ${roleId} does not exist`);
        }

        const newUser = await User.create({
            ...parameters,
            telephoneNumber1,
            telephoneNumber2,
            roleId: roleRecord?.id,
            title: title?.trim() ?? null,
            firstName: firstName?.trim(),
            lastName: lastName?.trim(),
            primaryEmail: primaryEmail?.trim(),
            secondaryEmail: secondaryEmail?.trim(),
        });

        return newUser;
    }

    async updateUser(parameters: UpdateUserPersisterInput): Promise<UserOutput> {
        const {
            userId,
            title,
            firstName,
            lastName,
            secondaryEmail,
            telephoneNumber1,
            telephoneNumber2,
            isActive,
        } = parameters;

        let updatedUser = await User.findOne({ where: { uuid: userId } });

        if (!updatedUser) {
            throw new UserProfileError(`Error: User uuid: ${userId} does not exist`);
        }

        return await updatedUser.update({
            title: title?.trim(),
            firstName: firstName?.trim(),
            lastName: lastName?.trim(),
            secondaryEmail: secondaryEmail?.trim(),
            telephoneNumber1,
            telephoneNumber2,
            isActive,
        });
    }

    async getUserClientAccounts(parameters: GetUserClientAccounts): Promise<UserAccountsReponse> {
        const { limit, offset, userId, name, subscriptionId, sortBy, sortDirection } = parameters;

        let userIdClause: any = {};

        let clientAccountsWhere: WhereOptions = {};

        userIdClause['$team.uuid$'] = userId;

        if (name) {
            clientAccountsWhere['name'] = {
                [Op.like]: `%${name}%`,
            };
        }
        if (subscriptionId) {
            clientAccountsWhere['$subscriptionType.uuid$'] = subscriptionId;
        }
        let orderBy: any = [sortBy, sortDirection];

        const user = await User.findOne({
            where: { uuid: userId },
        });

        if (!user) {
            throw new UserProfileError(`Error: UserUUID ${userId} does not exist`);
        }

        const clientsUuid = await ClientAccount.findAll({
            where: userIdClause,
            include: [
                {
                    model: User,
                    as: 'team',
                },
            ],
        });
        let clients: any = [];
        let total = 0;

        if (clientsUuid.length) {
            clientAccountsWhere['uuid'] = {
                [Op.or]: clientsUuid.map((client) => client.uuid),
            };

            const { rows, count } = await ClientAccount.findAndCountAll({
                where: clientAccountsWhere,
                distinct: true,
                include: [
                    { model: User, as: 'team' },
                    {
                        model: SubscriptionType,
                        as: 'subscriptionType',
                        required: true,
                    },
                ],

                order: [orderBy],
                limit: parseInt(limit!),
                offset: parseInt(offset!),
            });

            total = count;
            let currentTeamMemberType: any = 0;

            rows.map((account) => {
                let team: any = [];

                account.team?.map((item) => {
                    if (item.uuid === userId) {
                        currentTeamMemberType = item.ClientAccountTeam?.teamMemberType;
                    }
                    team.push({
                        firstName: item.firstName,
                        lastName: item.lastName,
                        primaryEmail: item.primaryEmail,
                        teamMemberType: item.ClientAccountTeam?.teamMemberType,
                    });
                });

                clients.push({
                    uuid: account.uuid,
                    name: account.name,
                    notes: account.notes,
                    subscription: {
                        uuid: account.subscriptionType?.uuid,
                        name: account.subscriptionType?.name,
                    },
                    teamMemberType: currentTeamMemberType,
                    collections: 0,
                    team: team,
                });
            });
        }
        return {
            totalRecords: clientsUuid.length,
            filteredRecords: total,
            clients: clients,
        };
    }
}

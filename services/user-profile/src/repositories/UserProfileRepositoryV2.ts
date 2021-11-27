import { Role, User } from '@dodsgroup/dods-model';
import {
    CreateUserPersisterInput,
    CreateUserPersisterOutput,
    GetUserInput,
    GetUserOutput,
    SearchUsersInput,
    SearchUsersOutput,
    UserProfileError,
    UserProfilePersisterV2,
} from '../domain';

import { Op } from 'sequelize';

export const LAST_NAME_COLUMN = 'lastName';
export const ROLE_ID_COLUMN = 'roleId';
export const ASC = 'ASC';
export const DODS_USER = '83618280-9c84-441c-94d1-59e4b24cbe3d';

export class UserProfileRepositoryV2 implements UserProfilePersisterV2 {

    static defaultInstance: UserProfilePersisterV2 = new UserProfileRepositoryV2();

    async getUser(parameters: GetUserInput): Promise<GetUserOutput> {

        const user = await User.findOne({ where: { uuid: parameters.userId }, include: [User.associations.role] });

        if (!user) {
            throw new UserProfileError(`Error: UserUUID ${parameters.userId} does not exist`);
        }

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.primaryEmail,
            role: user.role.title,
            isDodsUser: user.role.uuid === DODS_USER
        };
    }

    async searchUsers(parameters: SearchUsersInput): Promise<SearchUsersOutput> {
        const { name, startsWith, role, limit, offset, sortBy, sortDirection } = parameters;

        let whereClause: any = {};

        if (name) {
            whereClause = {
                [Op.or]: [
                    { firstName: { [Op.like]: `%${name}%` } },
                    { lastName: { [Op.like]: `%${name}%` } },
                ],
            };
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

        let orderBy: any = [sortBy, sortDirection];

        if (sortBy === 'role') {
            orderBy = [User.associations.role, 'title', sortDirection];
        } else if (sortBy === 'account') {
            orderBy = [User.associations.accounts, 'name', sortDirection];
        }

        const { rows, count } = await User.findAndCountAll({
            where: whereClause,
            subQuery: false,
            include: [
                User.associations.role,
                User.associations.accounts,
            ],
            order: [orderBy],
            offset: offset!,
            limit: limit!,
        });

        return {
            users: rows.map(
                ({ uuid, firstName, lastName, primaryEmail, role }) => ({
                    uuid,
                    firstName,
                    lastName,
                    email: primaryEmail,
                    role: role.title,
                    isDodsUser: role.uuid === DODS_USER
                })
            ),
            count,
        };
    }

    async createUser(parameters: CreateUserPersisterInput): Promise<CreateUserPersisterOutput> {

        const { roleId } = parameters;

        const roleRecord = await Role.findOne({ where: { uuid: roleId } });

        if (!roleRecord) {
            throw new UserProfileError(`Error: Role uuid: ${roleId} does not exist`);
        }

        const newUser = await User.create({
            ...parameters,
            telephoneNumber1: parameters.telephoneNumber,
            roleId: roleRecord?.id
        });

        return newUser;
    }
}

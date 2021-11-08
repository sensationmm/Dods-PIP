import { Role, User } from '@dodsgroup/dods-model';
import {
    SearchUsersInput,
    SearchUsersOutput,
    UserProfileError,
    UserProfilePersisterV2,
} from '../domain';

import { Op } from 'sequelize';

export const LAST_NAME_COLUMN = 'lastName';
export const ROLE_ID_COLUMN = 'roleId';
export const ASC = 'ASC';

export class UserProfileRepositoryV2 implements UserProfilePersisterV2 {
    static defaultInstance: UserProfilePersisterV2 =
        new UserProfileRepositoryV2();

    async searchUsers(
        parameters: SearchUsersInput
    ): Promise<SearchUsersOutput> {
        const { name, startsWith, role, limit, offset, sortBy, sortDirection } =
            parameters;

        let whereClause: any = {};

        if (name) {
            whereClause = {
                [Op.or]: [
                    { firstName: { [Op.like]: `${name}%` } },
                    { lastName: { [Op.like]: `${name}%` } },
                ],
            };
        }

        if (startsWith) {
            whereClause[LAST_NAME_COLUMN] = { [Op.like]: `${startsWith}%` };
        }

        let roleRecord: Role | null;
        if (role) {
            roleRecord = await Role.findOne({ where: { uuid: role } });

            if (!roleRecord) {
                throw new UserProfileError(
                    `Error: RoleUuid ${role} does not exist`
                );
            }

            whereClause[ROLE_ID_COLUMN] = roleRecord?.id;
        }

        const { rows, count } = await User.findAndCountAll({
            where: whereClause,
            subQuery: false,
            include: [User.associations.role],
            order: [sortBy!, sortDirection!],
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
                })
            ),
            count,
        };
    }
}

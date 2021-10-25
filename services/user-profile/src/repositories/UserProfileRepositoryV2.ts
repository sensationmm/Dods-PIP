import { User } from '@dodsgroup/dods-model';
import { Op, WhereOptions } from 'sequelize';

import { SearchUsersInput, SearchUsersOutput } from '../domain';
import { UserProfilePersisterV2 } from '../domain/interfaces/UserProfilePersisterV2';

export class UserProfileRepositoryV2 implements UserProfilePersisterV2 {

    static defaultInstance: UserProfilePersisterV2 = new UserProfileRepositoryV2();

    async searchUsers(parameters: SearchUsersInput): Promise<Array<SearchUsersOutput>> {

        const { name, limit, offset } = parameters;

        let whereClause: WhereOptions = {
            [Op.or]: [
                { firstName: { [Op.like]: `${name}%` } },
                { lastName: { [Op.like]: `${name}%` } }
            ]
        };

        const users = await User.findAll({
            where: whereClause,
            subQuery: false,
            include: [User.associations.role],
            order: [
                ['firstName', 'ASC'],
            ],
            offset: offset,
            limit: limit,
        });

        return users.map(({ id, firstName, lastName }) => ({ id, firstName, lastName }));
    }
}

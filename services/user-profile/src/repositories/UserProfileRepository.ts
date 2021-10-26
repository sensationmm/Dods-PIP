import { Op, WhereOptions } from 'sequelize';
import { RoleTypeModel, UserProfileModel } from '../db/models';
import {
    SearchUsersInput,
    SearchUsersOutput,
    UserProfileCreate,
    UserProfilePersister,
    UserProfileResponse,
    parseUserForCreation,
    parseUserForResponse,
} from '../domain/interfaces';

import { User } from '@dodsgroup/dods-model';

export class UserProfileError extends Error {
    constructor(message: string, cause: any) {
        super(message);
        this.name = 'UserProfileError';
        this.cause = cause;
    }

    public cause: any;
}

export class UserProfileRepository implements UserProfilePersister {
    static defaultInstance: UserProfilePersister = new UserProfileRepository(RoleTypeModel, UserProfileModel);

    constructor(private roleModel: typeof RoleTypeModel, private userModel: typeof UserProfileModel) { }

    async createUserProfile(userProfileParameters: UserProfileCreate): Promise<UserProfileResponse> {
        const newProfileRole = await this.roleModel.findOne({
            where: {
                uuid: userProfileParameters.role_id,
            },
        });

        if (!newProfileRole) {
            throw new UserProfileError(`Error: RoleId ${userProfileParameters.role_id} does not exist`, {});
        }

        let response: UserProfileModel | null = null;

        try {
            const newUserProfile = await this.userModel.create(
                parseUserForCreation(userProfileParameters)
            );

            await newUserProfile.setRole(newProfileRole);

            response = await this.userModel.findOne({
                where: {
                    uuid: newUserProfile.uuid,
                },
                include: 'role',
            });

            return parseUserForResponse(response!);
        } catch (error) {
            console.debug(error);
            throw new UserProfileError('Error: User Profile creation failed', error);
        }
    }

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

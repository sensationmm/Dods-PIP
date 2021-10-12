import { RoleTypeModel, UserProfileModel } from '../db/models';
import {
    UserProfileCreate,
    UserProfilePersister,
    UserProfileResponse,
    parseUserForCreation,
    parseUserForResponse,
} from '../domain';

export class UserProfileError extends Error {
    constructor(message: string, cause: any) {
        super(message);
        this.name = 'UserProfileError';
        this.cause = cause;
    }

    public cause: any;
}
export class UserProfileRepository implements UserProfilePersister {
    static defaultInstance: UserProfileRepository = new UserProfileRepository(
        RoleTypeModel,
        UserProfileModel
    );

    constructor(
        private roleModel: typeof RoleTypeModel,
        private userModel: typeof UserProfileModel
    ) {}

    async createUserProfile(
        userProfileParameters: UserProfileCreate
    ): Promise<UserProfileResponse> {
        const newProfileRole = await this.roleModel.findOne({
            where: {
                uuid: userProfileParameters.role_id,
            },
        });

        if (!newProfileRole) {
            throw new UserProfileError(
                `Error: RoleId ${userProfileParameters.role_id} does not exist`,
                {}
            );
        }

        let response: UserProfileModel;
        try {
            const newUserProfile = await this.userModel.create(
                parseUserForCreation(userProfileParameters)
            );
            newUserProfile.role = newProfileRole;

            response = await newUserProfile.save();

            return parseUserForResponse(response);
        } catch (error) {
            throw new UserProfileError('Error: User Profile creation failed', error);
        }
    }
}

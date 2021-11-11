import { UserProfileModel, UserProfileModelAttributes } from '../db';
import { UserProfilePersister } from '../domain';

export class UserProfileRepository implements UserProfilePersister {
    static defaultInstance: UserProfilePersister = new UserProfileRepository(UserProfileModel);

    constructor(private userModel: typeof UserProfileModel) { }

    async findOne(where: Partial<UserProfileModelAttributes>): Promise<UserProfileModel> {

        const clientAccountModel = await this.userModel.findOne({ where });

        if (clientAccountModel) {
            return clientAccountModel;
        } else {
            throw new Error('Error: userProfile not found');
        }
    }
}

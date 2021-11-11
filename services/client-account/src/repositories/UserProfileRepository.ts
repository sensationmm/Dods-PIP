import { UserProfileModel, UserProfileModelAttributes } from '../db';
import { col, fn, where } from 'sequelize';

import { UserProfilePersister } from '../domain';

export class UserProfileRepository implements UserProfilePersister {
    static defaultInstance: UserProfilePersister = new UserProfileRepository(
        UserProfileModel
    );

    constructor(private userModel: typeof UserProfileModel) {}

    async findOne(
        where: Partial<UserProfileModelAttributes>
    ): Promise<UserProfileModel> {
        const clientAccountModel = await this.userModel.findOne({ where });

        if (clientAccountModel) {
            return clientAccountModel;
        } else {
            throw new Error('Error: userProfile not found');
        }
    }

    async checkUserEmailAvailability(
        primaryEmailAddress: string
    ): Promise<boolean> {
        const lowerCaseEmail = primaryEmailAddress.trim().toLocaleLowerCase();
        const coincidences = await this.userModel.findAll({
            where: {
                primaryEmail: where(
                    fn('LOWER', col('primary_email')),
                    'LIKE',
                    lowerCaseEmail
                ),
            },
        });

        return coincidences.length == 0;
    }
}

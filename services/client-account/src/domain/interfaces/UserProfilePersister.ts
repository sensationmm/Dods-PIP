import { UserProfileModel, UserProfileModelAttributes } from '../../db';

export interface UserProfilePersister {
    findOne(
        where: Partial<UserProfileModelAttributes>
    ): Promise<UserProfileModel>;
    checkUserEmailAvailability(primaryEmailAddress: string): Promise<boolean>;
}

import { UserProfileCreate, UserProfileResponse } from '.';

export interface UserProfilePersister {
    createUserProfile(userProfileParameters: UserProfileCreate): Promise<UserProfileResponse>;
}

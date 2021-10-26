import { UserInput } from '@dodsgroup/dods-model';
import { UserProfileCreate, UserProfileResponse } from '.';

export type SearchUsersInput = {
    name: string;
    limit?: number;
    offset?: number;
}
export type SearchUsersOutput = Pick<UserInput, 'id' | 'firstName' | 'lastName'>;

export interface UserProfilePersister {
    createUserProfile(userProfileParameters: UserProfileCreate): Promise<UserProfileResponse>;
    searchUsers(parameters: SearchUsersInput): Promise<Array<SearchUsersOutput>>;
}

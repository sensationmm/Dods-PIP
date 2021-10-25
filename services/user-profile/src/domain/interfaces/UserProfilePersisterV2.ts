import { UserInput } from '@dodsgroup/dods-model';

export type SearchUsersInput = {
    name: string;
    limit?: number;
    offset?: number;
}
export type SearchUsersOutput = Pick<UserInput, 'id' | 'firstName' | 'lastName'>;

export interface UserProfilePersisterV2 {
    searchUsers(parameters: SearchUsersInput): Promise<Array<SearchUsersOutput>>;
}

import { UserInput } from '@dodsgroup/dods-model';

export type SearchUsersInput = {
    name?: string;
    startsWith?: string;
    role?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortDirection?: string;
}

export type SearchUsersResultType = Pick<UserInput, 'uuid' | 'firstName' | 'lastName'> & { email: string; role: string; };

export type SearchUsersOutput = {
    users: Array<SearchUsersResultType>;
    count: number;
}

export interface UserProfilePersisterV2 {
    searchUsers(parameters: SearchUsersInput): Promise<SearchUsersOutput>;
}

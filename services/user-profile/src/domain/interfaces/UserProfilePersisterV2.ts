import { User, UserInput } from '@dodsgroup/dods-model';

export type SearchUsersInput = {
    name?: string;
    startsWith?: string;
    role?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortDirection?: string;
}

export type SearchUsersResultType = Pick<UserInput, 'uuid' | 'firstName' | 'lastName'> & { email: string; role: string; isDodsUser: boolean; }

export type SearchUsersOutput = {
    users: Array<SearchUsersResultType>;
    count: number;
}


export type GetUserInput = {
    UserProfileUuid: string;
}


export type RequestOutput<T = any> = {
    success: boolean;
    data: T;
    error?: any;
}

export type CreateUserOutput = {
    userName: string;
}

export type UserAttributes = {
    Name: string;
    Value: string;
}

export interface IamPersister {
    createUser(email: string, clientAccountId: string, clientAccountName: string): Promise<RequestOutput<CreateUserOutput>>;
    updateUserAttributes(email: string, userAttributes: Array<UserAttributes>): Promise<void>;
}

export type CreateUserPersisterInput = Pick<UserInput, 'title' | 'firstName' | 'lastName' | 'primaryEmail' | 'secondaryEmail'> & { telephoneNumber?: string; roleName: string; }

export type CreateUserPersisterOutput = User;

export type CreateUserInput = CreateUserPersisterInput & { clientAccountId: string; clientAccountName: string; };

export type GetUserOutput = User;


export interface UserProfilePersisterV2 {
    getUser(parameters: GetUserInput): Promise<GetUserOutput | null>;
    searchUsers(parameters: SearchUsersInput): Promise<SearchUsersOutput>;
    createUser(parameters: CreateUserPersisterInput): Promise<CreateUserPersisterOutput>;
}

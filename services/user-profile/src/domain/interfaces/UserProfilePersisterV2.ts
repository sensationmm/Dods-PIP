import { UserInput, UserOutput } from '@dodsgroup/dods-model';

export type SearchUsersInput = {
    name?: string;
    startsWith?: string;
    role?: string;
    clientAccountId?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortDirection?: string;
};

export type SearchUsersResultType = Pick<
    UserInput,
    'uuid' | 'firstName' | 'lastName'
> & {
    primaryEmail: string;
    role: Object;
    isDodsUser: boolean;
    secondaryEmail: string | null;
    telephoneNumber1: string | null;
    telephoneNumber2: string | null;
    title: string | null;
    clientAccount: Object;
};

export type SearchUsersOutput = {
    users: Array<SearchUsersResultType>;
    count: number;
};

export type RequestOutput<T = any> = {
    success: boolean;
    data: T;
    error?: any;
};

export type CreateUserOutput = {
    userName: string;
};

export type UserAttributes = {
    Name: string;
    Value: string;
};

export interface IamPersister {
    createUser(
        email: string,
        clientAccountId: string,
        clientAccountName: string
    ): Promise<RequestOutput<CreateUserOutput>>;
    updateUserAttributes(
        email: string,
        userAttributes: Array<UserAttributes>
    ): Promise<void>;
}

export type CreateUserPersisterInput = Pick<
    UserInput,
    'title' | 'firstName' | 'lastName' | 'primaryEmail' | 'secondaryEmail'
> & { telephoneNumber?: string; roleId: string };

export type CreateUserPersisterOutput = UserOutput;

export type CreateUserInput = CreateUserPersisterInput & {
    clientAccountId: string;
};

export type GetUserInput = { userId: string };

export type GetUserOutput =
    | Pick<UserInput, 'firstName' | 'lastName'>
    | { email: string; role: string; isDodsUser: boolean };

export interface UserProfilePersisterV2 {
    getUser(parameters: GetUserInput): Promise<GetUserOutput>;
    searchUsers(parameters: SearchUsersInput): Promise<SearchUsersOutput>;
    createUser(
        parameters: CreateUserPersisterInput
    ): Promise<CreateUserPersisterOutput>;
}

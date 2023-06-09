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
    isActive?: string;
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
    isActive: boolean;
    memberSince: Date;
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
    updateUserAttributes(email: string, userAttributes: Array<UserAttributes>): Promise<void>;

    enableUser(email: string): Promise<void>;

    disableUser(email: string): Promise<void>;
}

export type CreateUserPersisterInput = Pick<
    UserInput,
    'title' | 'firstName' | 'lastName' | 'primaryEmail' | 'secondaryEmail'
> & { telephoneNumber1?: string; telephoneNumber2?: string; roleId: string };

export type CreateUserPersisterOutput = UserOutput;

export type CreateUserInput = CreateUserPersisterInput & {
    clientAccountId: string;
};

export type UpdateUserPersisterInput = Omit<Partial<UserInput>, 'primaryEmail'> & {
    userId: string;
};

export type UpdateUserPersisterOutput = UserOutput;

export type UpdateUserInput = UpdateUserPersisterInput;

export type GetUserInput = { userId: string };

export type GetUserClientAccounts = {
    userId: string;
    name?: string;
    subscriptionId?: string;
    limit?: string;
    offset?: string;
    sortBy?: string;
    sortDirection?: string;
};

export type SearchClientsByResultType = {
    uuid: string;
    name: string;
    notes: string;
    subscription: Object;
};

export type UserAccountsReponse = {
    totalRecords: number;
    filteredRecords: number;
    clients: Array<SearchClientsByResultType>;
};

export type ClientAccountObj = {
    uuid: string | undefined;
    name: string | undefined;
    teamMemberType: number | undefined;
};

export enum TeamMemberTypes {
    DODS_Consultant = 1,
    AccountManager = 2,
    ClientUser = 3,
}

export type GetUserOutput = {
    firstName: string;
    lastName: string;
    primaryEmail: string;
    role: Object;
    isDodsUser: boolean;
    secondaryEmail?: string | null;
    telephoneNumber1: string | null;
    telephoneNumber2?: string | null;
    title: string | null;
    clientAccount: ClientAccountObj;
    clientAccountId: string | null;
    isActive: boolean;
    memberSince: Date;
};

export interface UserProfilePersisterV2 {
    getUser(parameters: GetUserInput): Promise<GetUserOutput>;
    searchUsers(parameters: SearchUsersInput): Promise<SearchUsersOutput>;
    createUser(parameters: CreateUserPersisterInput): Promise<CreateUserPersisterOutput>;
    getUserClientAccounts(parameters: GetUserClientAccounts): Promise<UserAccountsReponse>;
    updateUser(parameters: UpdateUserPersisterInput): Promise<UpdateUserPersisterOutput>;
}

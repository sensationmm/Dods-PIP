export type GetUserInput = {
    userId: string;
}

export type ClientAccountObj = {
    uuid: string | undefined;
    name: string | undefined;
};

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

export interface UserProfile {
    getUser(parameters: GetUserInput): Promise<GetUserOutput>;
}
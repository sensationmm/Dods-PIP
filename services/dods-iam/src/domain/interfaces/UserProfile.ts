export type GetUserInput = {
    userProfileUuid: string;
}

export type GetUserOutput = {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isDodsUser: boolean;
}

export interface UserProfile {
    getUser(parameters: GetUserInput): Promise<GetUserOutput>;
}
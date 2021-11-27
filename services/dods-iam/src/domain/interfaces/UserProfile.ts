export type GetUserInput = {
    userId: string;
}

export type GetUserOutput = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isDodsUser: boolean;
}

export interface UserProfile {
    getUser(parameters: GetUserInput): Promise<GetUserOutput>;
}
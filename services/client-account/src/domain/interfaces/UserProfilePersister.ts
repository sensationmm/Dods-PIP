import { UserInput, UserOutput } from '@dodsgroup/dods-model';
import { RequestOutput } from '.';

export type CreateUserPersisterInput = Pick<UserInput, 'title' | 'firstName' | 'lastName' | 'primaryEmail' | 'secondaryEmail'> & { telephoneNumber?: string; roleId: string; clientAccountId: string; }
export type CreateUserPersisterOutput = UserOutput;

export type CreateUserOutput = {
    displayName: string;
    userName: string;
    emailAddress: string;
    userId: string;
    roleId: string;
    clientAccount: {
        id: string;
        name: string;
    }
}
export interface UserProfilePersister {
    findOne(where: Partial<UserInput>): Promise<UserOutput>;
    checkUserEmailAvailability(primaryEmailAddress: string): Promise<boolean>;
    createUser(parameters: CreateUserPersisterInput): Promise<RequestOutput<CreateUserOutput>>;
    updateUser(values: Partial<UserInput>, where: Partial<UserInput>): Promise<void>;
}

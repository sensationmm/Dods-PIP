import { UserInput, UserOutput } from '@dodsgroup/dods-model';
import { UserProfileModel, UserProfileModelAttributes } from '../../db';

export type CreateUserPersisterInput = Pick<UserInput, 'title' | 'firstName' | 'lastName' | 'primaryEmail' | 'secondaryEmail'> & { telephoneNumber?: string; roleId: string; }
export type CreateUserPersisterOutput = UserOutput;

export type RequestOutput<T = any> = {
    success: boolean;
    data: T;
    error?: any;
}

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
    findOne(where: Partial<UserProfileModelAttributes>): Promise<UserProfileModel>;
    checkUserEmailAvailability(primaryEmailAddress: string): Promise<boolean>;
    createUser(parameters: CreateUserPersisterInput): Promise<RequestOutput<CreateUserOutput>>;
}

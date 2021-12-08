import { UserInput, UserOutput } from '@dodsgroup/dods-model';

import { RequestOutput } from '.';
import { UserProfileModelAttributes } from '../../db';

export type CreateUserPersisterInput = Pick<UserInput, 'title' | 'firstName' | 'lastName' | 'primaryEmail' | 'secondaryEmail'> & { telephoneNumber?: string; roleId: string; clientAccountId: string; }
export type CreateUserPersisterOutput = UserOutput;

export type CreateUserOutput = {
    uuid: string;
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
    findOne(where: Partial<UserProfileModelAttributes>): Promise<UserProfileModelAttributes>;
    checkUserEmailAvailability(primaryEmailAddress: string): Promise<boolean>;
    createUser(parameters: CreateUserPersisterInput): Promise<RequestOutput<CreateUserOutput>>;
    updateUser(values: Partial<UserProfileModelAttributes>, where: Partial<UserProfileModelAttributes>): Promise<void>;
}



export interface UserProfilePersisterV2 {
    findOne(where: Partial<UserInput>): Promise<UserOutput>;
    checkUserEmailAvailability(primaryEmailAddress: string): Promise<boolean>;
    createUser(parameters: CreateUserPersisterInput): Promise<RequestOutput<CreateUserOutput>>;
    updateUser(values: Partial<UserInput>, where: Partial<UserInput>): Promise<void>;
}
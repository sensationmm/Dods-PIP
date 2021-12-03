import { Optional } from 'sequelize/types';

export interface UserProfileModelAttributes {
    id: number;
    uuid: string;
    roleId: number;
    firstName: string;
    lastName: string;
    title: string;
    primaryEmail: string;
    secondaryEmail?: string;
    telephoneNumber1?: string;
    telephoneNumber2?: string;
    fullName: string;
    isActive?: boolean;
}

export interface UserProfileModelCreationAttributes
    extends Optional<
        UserProfileModelAttributes,
        | 'id'
        | 'uuid'
        | 'secondaryEmail'
        | 'telephoneNumber1'
        | 'telephoneNumber2'
        | 'fullName'
    > {}

//import { Optional } from 'sequelize/types';

export interface UserProfileModelAttributes {
    id: number;
    uuid: string;
    roleId: number;
    firstName:string;
    lastName:string;
    title: string;
    primaryEmail:string;
    secondaryEmail:string;
    telephoneNumber_1:string;
    telephoneNumber_2:string;
    fullName?: string;
}

// export interface ClientAccountModelCreationAttributes
//     extends Optional<
//         ClientAccountModelAttributes,
//         'id' | 'uuid' | 'subscriptionSeats'
//     > {}

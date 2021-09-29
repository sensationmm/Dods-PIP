import { Optional } from 'sequelize/types';

export interface ClientAccountModelAttributes {
    id: number;
    uuid: string;
    name: string;
    notes: string | null;
    contactName: string;
    contactEmailAddress: string;
    contactTelephoneNumber: string;
    subscriptionSeats: number;
    contractStartDate: Date;
    contractRollover: boolean;
    contractEndDate: Date | null;
}

export interface ClientAccountModelCreationAttributes
    extends Optional<ClientAccountModelAttributes, 'id' | 'uuid' | 'subscriptionSeats'> {}

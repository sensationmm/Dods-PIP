import { Optional } from 'sequelize/types';

export interface ClientAccountModelAttributes {
    id: number;
    uuid: string;
    name: string;
    notes?: string;
    contactName: string;
    contactEmailAddress: string;
    contactTelephoneNumber: string;
    subscriptionSeats?: number;
    contractStartDate?: Date;
    contractRollover?: boolean;
    contractEndDate?: Date;
    consultantHours?: number;
    isUk?: boolean;
    isEu?: boolean;
    isCompleted?: boolean;
    lastStepCompleted?: number;
}

export interface ClientAccountModelCreationAttributes
    extends Optional<
        ClientAccountModelAttributes,
        | 'id'
        | 'uuid'
        | 'subscriptionSeats'
        | 'consultantHours'
        | 'contractStartDate'
        | 'contractRollover'
        | 'contractEndDate'
        | 'isCompleted'
        | 'lastStepCompleted'
        | 'isUk'
        | 'isEu'
    > {}

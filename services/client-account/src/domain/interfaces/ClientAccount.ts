import { Pagination } from '../interfaces';
import { SubscriptionTypeResponse } from '..';

export interface ClientAccount {
    name: string;
    notes?: string;
    subscriptionSeats?: number;
    contactName: string;
    contactEmailAddress: string;
    contactTelephoneNumber: string;
    contractStartDate?: Date;
    contractRollover?: boolean;
    contractEndDate?: Date;
    consultantHours?: number;
    isUk?: boolean;
    isEu?: boolean;
    isCompleted?: boolean;
    lastStepCompleted?: number;
}

export interface ClientAccountParameters {
    clientAccount: ClientAccount;
}

export interface ClientAccountResponse extends ClientAccount {
    //id: number;
    uuid: string;

    subscription?: SubscriptionTypeResponse;
}

export interface SearchClientAccountResponse {
    id: string;
    name: string;
    notes?: string;
    subscription?: string;
    location?: number;
    projects?: number;
    team?: {
        name: string;
        type?: 'consultant' | 'client';
    }[];
    isUk: boolean;
    isEu: boolean;
    isCompleted: boolean;
    lastStepCompleted: number;
}

export interface SearchClientAccountParameters extends Pagination {
    //locations?: number[] | null;
    locations?: string | null;
    subscriptionTypes?: number[] | null;
    searchTerm?: string | null;
    startsBy?: string | null;
}
export interface GetClientAccountParameters {
    clientAccountId: string;
}

export interface UpdateClientAccountParameters {
    clientAccountId: string;
    subscription: string;
    subscriptionSeats: number;
    consultantHours: number;
    contractStartDate: string;
    contractRollover: boolean;
    contractEndDate?: string;
    isUk: boolean;
    isEu: boolean;
}

export interface UpdateClientAccountHeaderParameters {
    clientAccountId: string;
    name: string;
    notes: string;
    contactName: string;
    contactEmailAddress: string;
    contactTelephoneNumber: string;
}

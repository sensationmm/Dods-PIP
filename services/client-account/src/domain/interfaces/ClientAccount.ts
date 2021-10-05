import { Pagination } from '../interfaces';
import SubscriptionType from '../../db/models/SubscriptionType';

export interface ClientAccount {
    name: string;
    notes: string | null;
    subscription_seats?: number;
    contact_name: string;
    contact_email_address: string;
    contact_telephone_number: string;
    contract_start_date: string | Date;
    contract_rollover: boolean;
    contract_end_date?: string | Date;
    consultant_hours?: number;
}

export interface ClientAccountParameters {
    clientAccount: ClientAccount;
}

export interface ClientAccountResponse extends ClientAccount {
    //id: number;
    uuid: string;

    subscription?: SubscriptionType | number;
}

export interface SearchClientAccountResponse {
    id: string;
    name: string;
    notes: string | null;
    subscription?: string | undefined;
    location?: number | undefined;
    projects?: number;
    team?:
        | {
              name: string | undefined;
              type: 'consultant' | 'client' | undefined;
          }[]
        | undefined;
    completed: boolean;
}

export interface SearchClientAccountParameters extends Pagination {
    locations?: number[] | null;
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
    subscription_seats: number;
    consultant_hours: number;
    contract_start_date: string;
    contract_rollover: boolean;
    contract_end_date?: string;
}

export interface ClientAccountParameters extends ClientAccount {}

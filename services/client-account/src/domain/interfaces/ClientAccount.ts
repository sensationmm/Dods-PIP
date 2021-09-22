import { Pagination } from "../interfaces";
import SubscriptionType from "../../db/models/SubscriptionType";

export interface ClientAccount {
    name: string;
    notes: string | null;
    contact_name: string;
    contact_email_address: string;
    contact_telephone_number: string;
    contract_start_date: string;
    contract_rollover: boolean;
    contract_end_date?: string;
    // SubscriptionType: {} | undefined;
}

export interface ClientAccountResponse extends ClientAccount {
    id: number;
    uuid: string;
    subscription: SubscriptionType | undefined
}

export interface ClientAccountParameters extends ClientAccount {
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

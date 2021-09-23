import { Pagination } from "../interfaces";
import SubscriptionType from "../../db/models/SubscriptionType";
import { ClientAccountTeamModel, SubscriptionTypeModel } from "../../db";

export interface ClientAccount {
    name: string;
    notes: string | null;
    contact_name: string;
    contact_email_address: string;
    contact_telephone_number: string;
    contract_start_date: string;
    contract_rollover: boolean;
    contract_end_date?: string;
}

export interface ClientAccountResponse extends ClientAccount {
    id: number;
    uuid: string;
    subscription: SubscriptionType | null
}

export interface ClientAccountParameters extends ClientAccount {
}

export interface SearchClientAccountResponse {
    id: string;
    name: string;
    notes: string | null;
    subscription: "level1" | "level2" | "level3" | "level4";
    location: string;
    projects: number;
    team: {
        name: string;
        type: "consultant" | "client";
    },
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

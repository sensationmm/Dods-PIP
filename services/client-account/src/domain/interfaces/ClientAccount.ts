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
}

export interface ClientAccountResponse extends ClientAccount {
    id: number
    uuid: string;
    subscription: SubscriptionType
}

export interface GetClientAccountParameters {
    clientAccountId: string;
}
import { Pagination } from "..";

export interface SetAlertRecipientsInput {
    collectionId: string;
    alertId: string;
    updatedBy: string;
    recipients: Array<{ userId: string; }>;
}

export interface SetAlertRecipientsOutput {
    uuid: string;
    title: string;
    description: string;
    collection: {
        uuid: string;
        name: string;
    },
    template: {
        id: number; //alert template id
        name: string;
    },
    schedule: string;
    timezone: string;
    searchQueriesCount: number; //Count of dods_alerts_queries related to the alert
    recipientsCount: number; //Count of dods_alerts_recipients related to the alert
    lastStepCompleted: number;
    isPublished: false;
    createdBy: {
        uuid: string;
        name: string;
        emailAddress: string;
    },
    createdAt: Date;
    updatedBy: {
        uuid: string;
        name: string;
        emailAddress: string;
    },
    updatedAt: Date;
    recipients: Array<{ userId: string; name: string; emailAddress: string; }>
}

export interface DeleteAlertRecipientInput {
    collectionId: string;
    alertId: string;
    userId: string;
}

export interface AlertRecipientsOutput {
    uuid: string;
    name: string;
    emailAddress: string;
    clientAccount: {
        uuid: string;
        name: string;
    };
    isDODSUser: boolean;
    isActive: boolean;
}

export interface SearchAlertRecipientsInput extends Pagination {
    collectionId: string;
    alertId: string;
    searchTerm?: string;
    sortBy?: 'firstName' | 'clientAccountName' | 'isActive';
    sortDirection?: 'ASC' | 'DESC';
}

export type SearchAlertRecipientsOutput = {
    limit: number;
    offset: number;
    totalRecords: number;
    filteredRecords: number;
    data: Array<AlertRecipientsOutput>;
};

export interface CollectionAlertRecipientPersister {
    list(parameters: SearchAlertRecipientsInput): Promise<SearchAlertRecipientsOutput>;
    setAlertRecipients(parameters: SetAlertRecipientsInput): Promise<SetAlertRecipientsOutput>;
    delete(parameters: DeleteAlertRecipientInput): Promise<boolean>;
}

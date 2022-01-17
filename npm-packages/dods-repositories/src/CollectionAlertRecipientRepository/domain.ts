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

export interface CollectionAlertRecipientPersister {
    setAlertRecipients(parameters: SetAlertRecipientsInput): Promise<SetAlertRecipientsOutput>;
    delete(parameters: DeleteAlertRecipientInput): Promise<boolean>;
}

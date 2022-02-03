export interface CreateCollectionParameters {
    clientAccountId: string;
    createdById: string;
    name: string;
}

export interface CollectionResponse {
    uuid: string;
    name: string;
    isActive: boolean;
    clientAccount?: {
        uuid: string;
        name: string;
    };
    createdBy?: {
        uuid: string;
        name: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface ProcessAlertParameters {
    collectionId: string;
    alertId: string;
}

export interface ProcessImmediateAlertParameters {
    alertId: string;
    documentId: string;
}

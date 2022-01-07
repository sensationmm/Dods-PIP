export interface SearchCollectionAlertsParameters {
    collectionId: string;
    limit: string;
    offset: string;
}

export interface CollectionAlertsResponse {
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
    collection?: {
        uuid: string;
        name: string;
    }
    createdAt: Date;
    updatedAt: Date;
}

export interface getAlertsByCollectionResponse {
    count: number,
    alerts: Array<Object>
}

export interface CollectionAlertsPersister {

    getCollectionAlerts(parameters: SearchCollectionAlertsParameters): Promise<getAlertsByCollectionResponse>;
}

export interface CreateAlertParameters {
    collectionId: string,
    title: string,
    alertQueries?: [{
        query: string,
        informationTypes: string,
        contentSources: string
    }]
    createdBy: string
}

export interface CreateAlertQuery {

    alertId: number,
    query: string,
    informationTypes: string,
    contentSources: string,
    createdBy: number

}



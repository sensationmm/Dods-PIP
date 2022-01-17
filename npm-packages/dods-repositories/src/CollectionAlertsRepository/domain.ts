export interface AlertOutput {
    id: number;
    uuid: string;
    collection: { uuid?: string, name?: string } | {}
    template: { id?: string, name?: string } | {}
    isSchedule: boolean;
    title: string;
    description?: string | null;
    schedule?: string | null;
    timezone?: string | null;
    isActive?: boolean;
    isPublished?: boolean;
    lastStepCompleted?: number;
    isScheduled?: boolean;
    hasKeywordsHighlight?: boolean;
    createdBy: { uuid?: string, name?: string, emailAddress?: string, isDodsUser?: boolean } | {}
    createdAt?: Date;
    updatedBy: { uuid?: string, name?: string, emailAddress?: string } | {}
    updatedAt?: Date | null;
}

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
    alertQueries: [{
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

export interface setAlertScheduleParameters {
    collectionId: string,
    alertId: string,
    isScheduled: boolean,
    hasKeywordHighlight: boolean,
    timezone: string,
    schedule: string,
    updatedBy: string,
    alertTemplateId: number
}

export interface SearchAlertParameters {
    collectionId: string;
    alertId: string;
}

export interface AlerByIdOutput {
    alert: AlertOutput,
    searchQueriesCount: number,
    recipientsCount: number
}

export interface CopyAlertParameters {
    collectionId: string;
    alertId: string;
    destinationCollectionId: string;
    createdBy: string;
}

export interface CopyAlertResponse {
    alert: AlertOutput,
    documentsCount: number,
    searchQueriesCount: number,
    recipientsCount: number
}

export interface SearchAlertQueriesParameters {
    alertId: string;
    limit?: string;
    offset?: string;
    sortDirection?: string;
}

export interface AlertQueryResponse {
    uuid: string;
    name: string,
    informationTypes: string;
    alert: {
        uuid: string,
        title: string
    }
    contentSources: string;
    query: string;
    createdBy?: {
        uuid: string;
        name: string;
        emailAddress: string;
        isDodsUser?: boolean;
    } | null,
    updatedBy?: {
        uuid: string;
        name: string;
        emailAddress: string;
        isDodsUser?: boolean;
    } | null,
    createdAt: Date;
    updatedAt: Date;
}

export interface getQueriesResponse {
    queries: AlertQueryResponse[];
    count: number;
}

export interface DeleteAlertParameters {
    collectionId: string;
    alertId: string;
}

export interface CreateAlertQueryParameters {
    alertId: string | number;
    informationTypes: string;
    contentSources: string;
    query: string;
    createdBy: string | number;
}

export interface UpdateAlertQuery {
    collectionId: string;
    alertId: string;
    queryId: string;
    contentSources: string,
    informationTypes: string,
    query: string,
    updatedBy: string
}
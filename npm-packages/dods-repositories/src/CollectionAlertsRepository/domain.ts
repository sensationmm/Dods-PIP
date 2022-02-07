export interface AlertOutput {
    id: number;
    uuid: string;
    collection?: {
        uuid: string,
        name: string,
        clientAccount?: {
            uuid: string,
            name: string,
        }
    }
    template?: { id: number, name: string }
    elasticQuery?: string;
    title: string;
    description?: string | null;
    schedule?: string | null;
    timezone?: string | null;
    isActive?: boolean;
    isPublished?: boolean;
    lastStepCompleted?: number;
    isScheduled?: boolean;
    hasKeywordsHighlight?: boolean;
    createdBy?: { uuid: string, name: string, emailAddress: string, isDodsUser: boolean }
    createdAt?: Date;
    updatedBy?: { uuid: string, name: string, emailAddress: string, isDodsUser: boolean }
    updatedAt?: Date | null;
    lastExecutedAt?: Date;
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
    copyQuery(parameters: CopyQueryParameters): Promise<AlertQueryResponse>;
    getCollectionAlerts(
        parameters: SearchCollectionAlertsParameters
    ): Promise<getAlertsByCollectionResponse>;
    updateAlert(parameters: UpdateAlertParameters): Promise<AlertOutput>;
}

export interface CreateAlertParameters {
    collectionId: string;
    title: string;
    createdBy: string;
}
export interface CreateAlertQuery {
    alertId: number;
    query: string;
    informationTypes: string;
    contentSources: string;
    createdBy: number;
}

export interface setAlertScheduleParameters {
    collectionId: string;
    alertId: string;
    isScheduled: boolean;
    hasKeywordHighlight: boolean;
    timezone: string;
    schedule: string;
    updatedBy: string;
    alertTemplateId: number;
}

export interface SearchAlertParameters {
    collectionId: string;
    alertId: string;
}

export interface AlertByIdOutput {
    alert: AlertOutput;
    searchQueriesCount: number;
    recipientsCount: number;
}

export interface CopyAlertParameters {
    collectionId: string;
    alertId: string;
    destinationCollectionId: string;
    createdBy: string;
}

export interface CopyAlertResponse {
    alert: AlertOutput;
    documentsCount: number;
    searchQueriesCount: number;
    recipientsCount: number;
}

export interface SearchAlertQueriesParameters {
    alertId: string;
    limit?: string;
    offset?: string;
    sortDirection?: string;
}

export interface CopyQueryParameters {
    queryId: string;
    destinationAlertId: string;
    createdBy: string;
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

export interface DeleteAlertQueryParameters {
    collectionId: string;
    alertId: string;
    queryId: string;
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

export interface SetAlertQueriesParameters {
    collectionId: string;
    alertId: string;
    updatedBy: string;
    alertQueries: [
        {
            query: string;
            informationTypes: string;
            contentSources: string;
        }
    ];
}

export interface UpdateAlertParameters {
    collectionId: string;
    alertId: string;
    updatedBy: string;
    title: string;
}

export interface AlertWithQueriesOutput {
    alert: AlertOutput,
    queries: AlertQueryResponse[]
}

export interface createESQueryParameters {
    query: string;
}

export interface updateAlertElasticQueryParameters {
    alertId: string;
}
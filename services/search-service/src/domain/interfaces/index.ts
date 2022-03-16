export interface GetContentParameters {
    contentId: string;
}

export interface RawQueryParameters {
    query: object;
    sort?: object;
    aggregations?: object;
    size?: number;
    from?: number;
}

export interface createPercolatorParameters {
    query: string;
    alertId: string;
}

export interface updatePercolatorParameters extends createPercolatorParameters {
}

export interface deletePercolatorParameters {
    alertId: string;
}

export interface deleteContentParameters {
    contentId: string;
}
export interface CreateESQueryParameters {
    queryString: string;
    informationTypes: string;
    contentSources: string;
}
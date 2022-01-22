export interface GetContentParameters {
    contentId: string;
}

export interface RawQueryParameters {
    query: string;
}

export interface createPercolatorParameters {
    query: string;
    alertId: string;
}
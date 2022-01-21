export interface GetContentParameters {
    contentId: string;
}

export interface RawQueryParameters {
    query: string;
}

export interface createPercolatorParameters {
    query: string;
}

export interface updatePercolatorParameters extends createPercolatorParameters{
    percolatorId: string
}
export interface TaxonomiesParameters {
    id?: string,
    start?: number,
    tags?: string,
    limit?: number,
    page?: number,
    parent?: string,
}

export interface TaxonomyItem {
    id: string,
    tag: string,
    score: string,
    inScheme: string[]
}

export interface DownstreamEndpoints {
    taxonomiesEndpointUrl: string;
}
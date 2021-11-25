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
    alternative_labels: string[]
}

export interface DownstreamEndpoints {
    taxonomiesEndpointUrl: string;
}

export interface TaxonomyTree  extends Array<TaxonomyNode>{

}

export interface TaxonomyNode {
    termName: string;
    id: string;
    childTerms: TaxonomyNode[];
}
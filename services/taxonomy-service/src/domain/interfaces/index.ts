export interface TaxonomiesParameters {
    id?: string,
    start?: number,
    tags?: string,
    limit?: number,
    page?: number,
    parent?: string,
    taxonomy?: string,
}

export interface TaxonomyItem {
    tagId: string;
    facetType?: string;
    termLabel: string;
    score: number;
    inScheme: string[];
    alternative_labels?: string[];
    hierarchy?: string;
    ancestorTerms?: string[];
}

export interface TaxonomySearchResponse {
    hitCount: number;
    results: Array<TaxonomyItem>;
    taxonomy: string;
}

export interface DownstreamEndpoints {
    taxonomiesEndpointUrl: string;
}

export interface TaxonomyTree extends Array<TaxonomyNode>{

}

export interface TaxonomyNode {
    termName: string;
    id: string;
    childTerms: TaxonomyNode[];
    ancestorTerms?: string[];
}
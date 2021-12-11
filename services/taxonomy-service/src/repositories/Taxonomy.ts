import {TaxonomiesParameters, TaxonomyNode, TaxonomySearchResponse, TaxonomyTree} from "../domain";

export interface Taxonomy {
    getTaxonomies(data: TaxonomiesParameters): Promise<any[ ]>;

    searchTaxonomies(data: TaxonomiesParameters): Promise<TaxonomySearchResponse>;

    buildTree(subset: string): Promise<TaxonomyTree>;

    getNarrowerTopics(narrower_topic: string): Promise<TaxonomyNode>
}
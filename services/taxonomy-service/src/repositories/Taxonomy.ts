import {TaxonomiesParameters, TaxonomyNode, TaxonomyTree} from "../domain";

export interface Taxonomy {
    getTaxonomies(data: TaxonomiesParameters): Promise<any[ ]>;

    searchTaxonomies(data: TaxonomiesParameters): Promise<any[ ]>;

    buildTree(): Promise<TaxonomyTree>;

    getNarrowerTopics(narrower_topic: string): Promise<TaxonomyNode>
}
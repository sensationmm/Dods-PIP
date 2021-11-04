import { TaxonomiesParameters, TaxonomyTree } from "../domain";

export interface Taxonomy {
    getTaxonomies(data: TaxonomiesParameters): Promise<any[ ]>;

    searchTaxonomies(data: TaxonomiesParameters): Promise<any[ ]>;

    buildTree(): Promise<TaxonomyTree>;
}
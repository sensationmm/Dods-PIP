import {TaxonomiesParameters, TaxonomySearchResponse} from "../domain";

export interface Taxonomy {
    searchTaxonomies(data: TaxonomiesParameters): Promise<TaxonomySearchResponse>;
}
import {TaxonomiesParameters} from "../domain";

export interface Taxonomy {
    getTaxonomies(data: TaxonomiesParameters): Promise<any[ ]>;

    searchTaxonomies(data: TaxonomiesParameters): Promise<any[ ]>;
}
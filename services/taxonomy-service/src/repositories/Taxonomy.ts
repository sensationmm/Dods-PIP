import { TaxonomiesParameters } from "../domain/interfaces";

export interface Taxonomy {
    getTaxonomies(data: TaxonomiesParameters): Promise<string>;
}
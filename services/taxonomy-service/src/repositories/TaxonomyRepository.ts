import { TaxonomiesParameters } from "../domain/interfaces";
import { Taxonomy } from "./Taxonomy";

export class TaxonomyRepository implements Taxonomy {

    static defaultInstance: Taxonomy = new TaxonomyRepository();

    async getTaxonomies(data: TaxonomiesParameters): Promise<string> {
        return data.id;
    }
}

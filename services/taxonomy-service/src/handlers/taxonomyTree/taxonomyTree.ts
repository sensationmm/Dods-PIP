import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { HttpSuccessResponse} from '../../domain';
import { TaxonomyRepository } from "../../repositories/TaxonomyRepository";
const TAXONOMIES = [
    'Topics',
    'Organisations',
    'Geographies',
    'People'
]
export const taxonomyTree = async (): Promise<APIGatewayProxyResultV2> => {
    let trees: any = {};
    await Promise.all(TAXONOMIES.map(async (taxonomy: string) => {
        trees[taxonomy] = await TaxonomyRepository.defaultInstance.buildTree(taxonomy);
    }));
    return new HttpSuccessResponse(trees);
};
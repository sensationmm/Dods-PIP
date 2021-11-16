import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { HttpSuccessResponse} from '../../domain';
import { TaxonomyRepository } from "../../repositories/TaxonomyRepository";

export const taxonomyTree = async (): Promise<APIGatewayProxyResultV2> => {
    return new HttpSuccessResponse(await TaxonomyRepository.defaultInstance.buildTree("Topics"));
};
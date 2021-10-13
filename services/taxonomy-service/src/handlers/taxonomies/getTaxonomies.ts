import { APIGatewayProxyResultV2 } from 'aws-lambda';
import {HttpBadRequestError, HttpSuccessResponse} from '../../domain';
import { TaxonomiesParameters } from '../../domain';
import { TaxonomyRepository } from "../../repositories/TaxonomyRepository";

export const getTaxonomies = async (requestPayload: TaxonomiesParameters): Promise<APIGatewayProxyResultV2> => {
    // Not the best way of doing it but on the swagger search and get by ID are the same endpoint
    if ('tags' in requestPayload) {
        return new HttpSuccessResponse(await TaxonomyRepository.defaultInstance.searchTaxonomies(requestPayload));
    }

    throw new HttpBadRequestError("No search tags")
};
import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { HttpSuccessResponse } from '../../domain/http';
import { TaxonomiesParameters } from '../../domain/interfaces';

export const getTaxonomies = async (requestPayload: TaxonomiesParameters): Promise<APIGatewayProxyResultV2> => {
    console.log(requestPayload.id);
    return new HttpSuccessResponse('Hello World');
};
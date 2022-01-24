import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { updatePercolatorParameters } from '../../domain';
import { SearchRepository } from "../../repositories/SearchRepository";

export const updatePercolator = async (requestPayload: updatePercolatorParameters): Promise<APIGatewayProxyResultV2> => {
    const percolatorQuery: updatePercolatorParameters = {alertId: requestPayload.alertId, query: requestPayload.query}
    let es_response = await SearchRepository.defaultInstance.updatePercolator(percolatorQuery);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: es_response,
    });
};
import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { createPercolatorParameters } from '../../domain';
import { SearchRepository } from "../../repositories/SearchRepository";

export const createPercolator = async (requestPayload: createPercolatorParameters): Promise<APIGatewayProxyResultV2> => {
    const percolatorQuery: createPercolatorParameters = {query: requestPayload.query, alertId: requestPayload.alertId}
    let es_response = await SearchRepository.defaultInstance.createPercolator(percolatorQuery);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: es_response,
    });
};
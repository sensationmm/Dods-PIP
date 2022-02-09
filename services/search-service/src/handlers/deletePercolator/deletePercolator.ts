import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { deletePercolatorParameters } from '../../domain';
import { SearchRepository } from "../../repositories/SearchRepository";

export const deletePercolator = async (requestPayload: deletePercolatorParameters): Promise<APIGatewayProxyResultV2> => {
    const percolatorQuery: deletePercolatorParameters = {alertId: requestPayload.alertId}
    let es_response = await SearchRepository.defaultInstance.deletePercolator(percolatorQuery);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: es_response,
    });
};
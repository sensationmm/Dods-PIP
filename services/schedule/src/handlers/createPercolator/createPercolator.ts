import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { createPercolatorParameters } from '../../domain';
import { ScheduleRepository } from '../../repositories';

export const createPercolator = async (requestPayload: createPercolatorParameters): Promise<APIGatewayProxyResultV2> => {
    console.log(requestPayload)
    const percolatorQuery: createPercolatorParameters = {query: requestPayload.query}
    let es_response = await ScheduleRepository.defaultInstance.createPercolator(percolatorQuery);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: es_response,
    });
};
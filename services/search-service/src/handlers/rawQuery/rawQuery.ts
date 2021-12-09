import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { RawQueryParameters } from '../../domain';
import { SearchRepository } from "../../repositories/SearchRepository";

export const rawQuery = async (requestPayload: RawQueryParameters): Promise<APIGatewayProxyResultV2> => {
    const query = JSON.parse(requestPayload['query'].replace(/'/g, '"'))
    let es_response = await SearchRepository.defaultInstance.rawQuery(query);

    return new HttpResponse(HttpStatusCode.OK, {
        es_response
    });
};
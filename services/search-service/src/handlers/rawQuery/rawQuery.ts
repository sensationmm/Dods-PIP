import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { RawQueryParameters } from '../../domain';
import { SearchRepository } from "../../repositories/SearchRepository";

export const rawQuery = async (requestPayload: RawQueryParameters): Promise<APIGatewayProxyResultV2> => {

    let es_response = await SearchRepository.defaultInstance.rawQuery(requestPayload);

    return new HttpResponse(HttpStatusCode.OK, {
        es_response
    });
};
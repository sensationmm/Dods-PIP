import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { GetContentParameters } from '../../domain';
import { SearchRepository } from "../../repositories/SearchRepository";

export const getContent = async (requestPayload: GetContentParameters): Promise<APIGatewayProxyResultV2> => {
    let es_response = await SearchRepository.defaultInstance.getContent(requestPayload);

    if (parseInt(es_response.body.hits.total.value) > 0) {

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Content found',
            totalRecords: es_response.body.hits.total.value,
            data: es_response.body.hits.hits[0]._source
        });
    }
    else {
        return new HttpResponse(HttpStatusCode.NOT_FOUND, {
            success: false,
            message: `No matches found for contentId: ${requestPayload.contentId}`,
        });
    }
};
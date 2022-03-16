import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { SearchRepository } from "../../repositories/SearchRepository";
import { deleteContentParameters } from '../../domain';

export const deleteContent = async (requestPayload: deleteContentParameters): Promise<APIGatewayProxyResultV2> => {
    let es_response = await SearchRepository.defaultInstance.deleteContent(requestPayload);

    if (es_response.result === 'deleted') {
        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Document Deleted',
        });
    }
    else {
        return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Imposible to delete document',
        });
    }

};
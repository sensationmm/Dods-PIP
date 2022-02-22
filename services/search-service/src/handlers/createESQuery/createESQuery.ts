import { HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository } from "@dodsgroup/dods-repositories";
import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { CreateESQueryParameters } from '../../domain';

export const createESQuery = async (requestPayload: CreateESQueryParameters): Promise<APIGatewayProxyResultV2> => {

    // @ts-ignore
    const esQuery = await new CollectionAlertsRepository().createElasticQuery({
        query: requestPayload.queryString,
        informationType: requestPayload.informationTypes,
        contentSource: requestPayload.contentSources
    })

    return new HttpResponse(HttpStatusCode.OK, {
        query: esQuery
    });
};
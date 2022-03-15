import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { DocumentStorageRepository } from '../../repositories';
//import { DocumentRepository } from '@dodsgroup/dods-repositories';
import { config } from '../../domain';
import { getAutoTaggingParameters } from '../../domain/interfaces';

const { aws: { lambdas: { auto_tagging } } } = config;
export const autoTagging: AsyncLambdaHandler<getAutoTaggingParameters> = async (params) => {

    const { content } = params;
    const contentPayload = { body: { content } }

    const response: any = await DocumentStorageRepository.defaultInstance.autoTagContent(auto_tagging, JSON.stringify(contentPayload))
    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Content successfully autotagged',
        payload: JSON.parse(response.Payload),
    })

};

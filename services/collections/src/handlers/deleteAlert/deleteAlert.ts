import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, DeleteAlertParameters, DocumentRepository } from '@dodsgroup/dods-repositories';

import { config } from '../../domain';

const { dods: { downstreamEndpoints: { apiGatewayBaseURL } } } = config;
//const baseURL = 'https://hxyqgu6qy7.execute-api.eu-west-1.amazonaws.com/dev'
const documentRepository = new DocumentRepository(apiGatewayBaseURL);

export const deleteAlert: AsyncLambdaHandler<DeleteAlertParameters> = async (params) => {
    const { alertId } = params
    const alertResponse: any = await CollectionAlertsRepository.defaultInstance.getAlert(params);

    if (alertResponse.alert.isScheduled) {
        // delete schedule 
        await documentRepository.deleteSchedule(alertId)
    }
    else {
        await documentRepository.deletePercolator(alertId)
    }

    await CollectionAlertsRepository.defaultInstance.deleteAlert(params)

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Alert was deleted successfully'
    });
}

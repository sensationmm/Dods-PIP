import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, DocumentRepository, mapAlert, setAlertScheduleParameters } from '@dodsgroup/dods-repositories';

import { config } from '../../domain';

const { dods: { downstreamEndpoints: { apiGatewayBaseURL } } } = config;
//const baseURL = 'https://hxyqgu6qy7.execute-api.eu-west-1.amazonaws.com/dev'
const documentRepository = new DocumentRepository(apiGatewayBaseURL);

export const setAlertSchedule: AsyncLambdaHandler<setAlertScheduleParameters> = async (
    parameters
) => {
    const { collectionId, alertId, schedule, isScheduled } = parameters

    const currentAlert = await CollectionAlertsRepository.defaultInstance.validateSchedule(parameters);

    let percolatorParameters;

    if (!isScheduled) {

        if (currentAlert.elasticQuery) {
            const elasticQuery: string = currentAlert.elasticQuery
            const mapElasticQuery = JSON.parse(elasticQuery)

            percolatorParameters = {
                alertId: alertId,
                query: mapElasticQuery
            }
        }
        else {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: 'Elastic Query not set',
            });
        }

        if (currentAlert.isPublished) {
            await documentRepository.updatePercolator(percolatorParameters)
        }
        else {
            await documentRepository.createPercolator(percolatorParameters)
        }

    }
    else {
        const scheduleParameters = {
            scheduleId: alertId,
            collectionId: collectionId,
            cron: schedule
        }
        await documentRepository.scheduleAlertWebhook(scheduleParameters)
    }

    const response = await CollectionAlertsRepository.defaultInstance.setAlertSchedule(parameters)

    const alertResponse: any = await mapAlert(response)

    const alertQuery = await CollectionAlertsRepository.defaultInstance.getQueriesByAlert(
        alertResponse.id
    );
    alertResponse.searchQueriesCount = alertQuery.length;
    const recipientsQuery = await CollectionAlertsRepository.defaultInstance.getRecipientsByAlert(alertResponse.id);
    alertResponse.recipientsCount = recipientsQuery.length;


    delete alertResponse?.id;

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'The alert scheduling was set successfully',
        alert: alertResponse
    });

};

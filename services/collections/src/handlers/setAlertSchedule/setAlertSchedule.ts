import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, DocumentRepository, mapAlert, setAlertScheduleParameters } from '@dodsgroup/dods-repositories';

import { config } from '../../domain';
import cronValidator from "cron-expression-validator";

const { dods: { downstreamEndpoints: { apiGatewayBaseURL } } } = config;
//const baseURL = 'https://hxyqgu6qy7.execute-api.eu-west-1.amazonaws.com/dev'
const documentRepository = new DocumentRepository(apiGatewayBaseURL);

export const setAlertSchedule: AsyncLambdaHandler<setAlertScheduleParameters> = async (
    parameters
) => {

    const { collectionId, alertId, schedule, isScheduled } = parameters
    // just validate schedule if is scheduled
    if (isScheduled) {
        const cronResult = cronValidator.isValidCronExpression(schedule)

        if (!cronResult) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: true,
                message: 'Please set a valid cron expression',
            });
        }
    }

    const response = await CollectionAlertsRepository.defaultInstance.setAlertSchedule(parameters)

    // This is call after if fail in serAlertSchedule previuosly
    if (isScheduled) {
        const scheduleParameters = {
            scheduleId: alertId,
            collectionId: collectionId,
            cron: schedule
        }
        await documentRepository.scheduleAlertWebhook(scheduleParameters)

    }

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

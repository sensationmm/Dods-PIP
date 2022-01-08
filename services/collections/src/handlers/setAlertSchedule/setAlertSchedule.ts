import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, setAlertScheduleParameters } from '@dodsgroup/dods-repositories';

export const setAlertSchedule: AsyncLambdaHandler<setAlertScheduleParameters> = async (
    parameters
) => {

    const response = await CollectionAlertsRepository.defaultInstance.setAlertSchedule(parameters)

    const alertResponse: any = CollectionAlertsRepository.defaultInstance.mapAlert(response)

    const alertQuery = await CollectionAlertsRepository.defaultInstance.getQuerysByAlert(alertResponse.id);
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

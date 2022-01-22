import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, mapAlert, setAlertScheduleParameters } from '@dodsgroup/dods-repositories';

export const setAlertSchedule: AsyncLambdaHandler<setAlertScheduleParameters> = async (
    parameters
) => {

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

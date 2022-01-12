import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, SearchAlertParameters } from '@dodsgroup/dods-repositories';


export const getAlert: AsyncLambdaHandler<SearchAlertParameters> = async (params) => {

    const alertResponse = await CollectionAlertsRepository.defaultInstance.getAlert(params);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'The alert was found',
        alert: {
            ...alertResponse.alert,
            searchQueriesCount: alertResponse.searchQueriesCount,
            recipientsCount: alertResponse.recipientsCount
        }
    });
};

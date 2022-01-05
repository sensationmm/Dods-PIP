import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { SearchCollectionAlertsParameters, getAlertsByCollectionResponse } from '../../domain';

import { CollectionAlertsRepository } from '../../repositories';

export const getCollectionAlerts: AsyncLambdaHandler<SearchCollectionAlertsParameters> = async (
    parameters
) => {

    parameters.offset = parameters.offset || '0';
    parameters.limit = parameters.limit || '5';

    try {
        const response: getAlertsByCollectionResponse = await CollectionAlertsRepository.defaultInstance.getCollectionAlerts(parameters);

        const alerts: any = response.alerts;
        const count = response.count;

        for (let item in alerts) {
            const alertsQuery = await CollectionAlertsRepository.defaultInstance.getQuerysByAlert(alerts[item].id);
            alerts[item].searchQueriesCount = alertsQuery.length;
            const recipientsQuery = await CollectionAlertsRepository.defaultInstance.getRecipientsByAlert(alerts[item].id);
            alerts[item].recipientsCount = recipientsQuery.length;
            delete alerts[item].id;
        }

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Collection alerts found',
            limit: parameters.limit,
            offset: parameters.offset,
            totalRecords: count,
            alerts: alerts

        });

    } catch (error) {
        return new HttpResponse(HttpStatusCode.NOT_FOUND, {
            success: true,
            message: 'Collection does not exist',
        });

    }


};

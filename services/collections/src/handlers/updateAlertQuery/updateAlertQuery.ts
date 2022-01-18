import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, UpdateAlertQuery } from '@dodsgroup/dods-repositories';

export const updateAlertQuery: AsyncLambdaHandler<UpdateAlertQuery> = async (
    params
) => {

    const updatedRecord = await CollectionAlertsRepository.defaultInstance.updateAlertQuery(
        params
    );
    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Alert query was updated successfully',
        query: updatedRecord

    });

};

import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { ProcessAlertParameters } from '../../domain';

export const processAlert: AsyncLambdaHandler<ProcessAlertParameters> = async (
    data
) => {

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'alert schedule with ID '+ data.alertId + ' from collection ' + data.collectionId + ' triggered'
    });
};

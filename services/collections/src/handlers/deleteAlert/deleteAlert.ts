import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, DeleteAlertParameters } from '@dodsgroup/dods-repositories';


export const deleteAlert: AsyncLambdaHandler<DeleteAlertParameters> = async (params) => {

    await CollectionAlertsRepository.defaultInstance.deleteAlert(params)

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Alert was deleted successfully'
    });
}

import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, CopyAlertParameters } from '@dodsgroup/dods-repositories';


export const copyAlert: AsyncLambdaHandler<CopyAlertParameters> = async (params) => {

    const alert = await CollectionAlertsRepository.defaultInstance.copyAlert(params);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'The alert scheduling was copied successfully',
        alert
    });
}

import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertRecipientRepository, SetAlertRecipientsInput } from '@dodsgroup/dods-repositories';

export const setAlertRecipients: AsyncLambdaHandler<SetAlertRecipientsInput> = async (params) => {

    const response = await CollectionAlertRecipientRepository.defaultInstance.setAlertRecipients(params);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'The alert recipients were set successfully',
        ...response,
    });
};

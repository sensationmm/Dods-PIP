import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertRecipientRepository, DeleteAlertRecipientInput } from '@dodsgroup/dods-repositories';

export const deleteAlertRecipient: AsyncLambdaHandler<DeleteAlertRecipientInput> = async (params) => {

    await CollectionAlertRecipientRepository.defaultInstance.delete(params);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Recipient was removed successfully',
    });
};

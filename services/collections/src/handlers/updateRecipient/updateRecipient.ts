import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertRecipientRepository, UpdateRecipientParameters } from '@dodsgroup/dods-repositories';

export const updateRecipient: AsyncLambdaHandler<UpdateRecipientParameters> = async (params) => {
    const recipient = await CollectionAlertRecipientRepository.defaultInstance.update(params);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'The recipient was updated successfully',
        recipient
    });
};

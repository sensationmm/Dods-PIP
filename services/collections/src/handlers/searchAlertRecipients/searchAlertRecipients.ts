import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertRecipientRepository, SearchAlertRecipientsInput } from '@dodsgroup/dods-repositories';

export const searchAlertRecipients: AsyncLambdaHandler<SearchAlertRecipientsInput> = async (params) => {

    const response = await CollectionAlertRecipientRepository.defaultInstance.list(params);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Alert recipients found',
        ...response,
    });
};

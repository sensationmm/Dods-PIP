import { AsyncLambdaMiddleware, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { SubscriptionTypeRepository } from '../../repositories';

export const getSubscriptionTypes: AsyncLambdaMiddleware = async () => {
    const response = await SubscriptionTypeRepository.defaultInstance.getSubscriptionTypes();

    return new HttpResponse(HttpStatusCode.OK, response);
};

import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { SubscriptionTypeRepository } from '../../repositories/SubscriptionTypeRepository';
import { HttpSuccessResponse } from '../../domain';

export const getSubscriptionTypes = async (): Promise<APIGatewayProxyResultV2> => {
    const response =
        await SubscriptionTypeRepository.defaultInstance.getSubscriptionTypes();

    return new HttpSuccessResponse(
        JSON.stringify(response)
    );
};

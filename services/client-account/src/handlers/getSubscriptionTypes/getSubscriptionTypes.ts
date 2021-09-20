import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ClientAccountRepository } from '../../repositories/ClientAccountRepository';
import { HttpSuccessResponse } from '../../domain';

export const getSubscriptionTypes = async (): Promise<APIGatewayProxyResultV2> => {
    const response =
        await ClientAccountRepository.defaultInstance.getSubscriptionTypes();

    return new HttpSuccessResponse(
        JSON.stringify(response)
    );
};

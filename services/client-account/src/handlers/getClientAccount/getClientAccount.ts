import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { HttpSuccessResponse } from '../../domain';
import { ClientAccountRepository } from '../../repositories/ClientAccountRepository';

export const getClientAccount = async ({ clientAccountId }: { clientAccountId: string }): Promise<APIGatewayProxyResultV2> => {

    const response = await ClientAccountRepository.defaultInstance.getClientAccount(clientAccountId);

    return new HttpSuccessResponse(`Hello world, parameters: ${JSON.stringify(response)}`);
};
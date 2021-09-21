import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { GetClientAccountParameters, HttpSuccessResponse } from '../../domain';
import { ClientAccountRepository } from '../../repositories/ClientAccountRepository';


export const getClientAccount = async (parameters: GetClientAccountParameters): Promise<APIGatewayProxyResultV2> => {
    const getClientAccount =
        await ClientAccountRepository.defaultInstance.getClientAccount(
            parameters.clientAccountId
        );
    return new HttpSuccessResponse({
        message: 'Client account found.',
        data: getClientAccount,
    });
};
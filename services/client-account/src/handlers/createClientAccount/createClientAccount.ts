import { ClientAccountParameters, HttpSuccessResponse } from '../../domain';

import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ClientAccountRepository } from '../../repositories/ClientAccountRepository';

export const createClientAccount = async (parameters: {
    clientAccount: ClientAccountParameters;
}): Promise<APIGatewayProxyResultV2> => {
    console.log(parameters);

    const newClientAccount =
        await ClientAccountRepository.defaultInstance.createClientAccount(
            parameters.clientAccount
        );

    return new HttpSuccessResponse({
        message: 'Client account successfully created.',
        data: newClientAccount,
    });
};

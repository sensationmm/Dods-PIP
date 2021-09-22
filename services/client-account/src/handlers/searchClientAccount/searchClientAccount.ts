import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ClientAccountRepository } from '../../repositories/ClientAccountRepository';
import { SearchClientAccountParameters, HttpSuccessResponse } from '../../domain';

// export const searchClientAccount = async ({ clientAccountId, }: { clientAccountId: string; }): Promise<APIGatewayProxyResultV2> => {
export const searchClientAccount = async (params: SearchClientAccountParameters): Promise<APIGatewayProxyResultV2> =>
{
    console.log('params :', params)
    const response = await ClientAccountRepository.defaultInstance.searchClientAccount(params);

    return new HttpSuccessResponse(
        JSON.stringify(response)
    );
};

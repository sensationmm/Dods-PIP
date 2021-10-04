import { AsyncLambdaMiddleware, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { GetClientAccountParameters } from '../../domain';
import { ClientAccountRepository } from '../../repositories';

export const getClientAccount: AsyncLambdaMiddleware<GetClientAccountParameters> = async (parameters) => {
    const getClientAccount = await ClientAccountRepository.defaultInstance.getClientAccount(parameters.clientAccountId);

    return new HttpResponse(HttpStatusCode.OK, {
        message: 'Client account found.',
        data: getClientAccount,
    });
};
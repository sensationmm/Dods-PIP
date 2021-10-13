import {
    AsyncLambdaMiddleware,
    HttpResponse,
    HttpStatusCode,
} from '@dodsgroup/dods-lambda';

import { ClientAccountRepository } from '../../repositories';
import { GetClientAccountParameters } from '../../domain';

export const getClientAccount: AsyncLambdaMiddleware<GetClientAccountParameters> =
    async (parameters) => {
        const getClientAccount =
            await ClientAccountRepository.defaultInstance.getClientAccount(
                parameters.clientAccountId
            );

        return new HttpResponse(HttpStatusCode.OK, {
            message: 'Client account found.',
            data: getClientAccount,
        });
    };

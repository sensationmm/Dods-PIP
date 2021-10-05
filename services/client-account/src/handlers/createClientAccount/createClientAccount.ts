import {
    AsyncLambdaMiddleware,
    HttpResponse,
    HttpStatusCode,
} from '@dodsgroup/dods-lambda';

import { ClientAccountParameters } from '../../domain';
import { ClientAccountRepository } from '../../repositories';

export const createClientAccount: AsyncLambdaMiddleware<ClientAccountParameters> =
    async (clientAccount) => {
        const newClientAccount =
            await ClientAccountRepository.defaultInstance.createClientAccount(
                clientAccount
            );

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Client account successfully created.',
            data: newClientAccount,
        });
    };

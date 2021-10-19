import {
    AsyncLambdaMiddleware,
    HttpResponse,
    HttpStatusCode,
} from '@dodsgroup/dods-lambda';

import { ClientAccountParameters } from '../../domain';
import { ClientAccountRepository } from '../../repositories';

export const createClientAccount: AsyncLambdaMiddleware<ClientAccountParameters> =
    async (parameters) => {
        const isNewAccountNameAvailable =
            await ClientAccountRepository.defaultInstance.checkNameAvailability(
                parameters.clientAccount.name
            );

        if (!isNewAccountNameAvailable) {
            return new HttpResponse(HttpStatusCode.CONFLICT, {
                success: false,
                message: `A Client Account already exists with the name: ${parameters.clientAccount.name}`,
            });
        }

        const newClientAccount =
            await ClientAccountRepository.defaultInstance.createClientAccount(
                parameters
            );

        if (newClientAccount)
            await ClientAccountRepository.defaultInstance.UpdateCompletion(
                newClientAccount.uuid,
                false,
                1
            );

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Client account successfully created.',
            data: newClientAccount,
        });
    };

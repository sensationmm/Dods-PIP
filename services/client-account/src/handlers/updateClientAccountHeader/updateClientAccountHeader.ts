import {
    AsyncLambdaMiddleware,
    HttpResponse,
    HttpStatusCode,
} from '@dodsgroup/dods-lambda';

import { ClientAccountRepository } from '../../repositories';
import { UpdateClientAccountHeaderParameters } from '../../domain';

export const updateClientAccountHeader: AsyncLambdaMiddleware<UpdateClientAccountHeaderParameters> =
    async (clientAccount) => {
        const isNameAvailable =
            await ClientAccountRepository.defaultInstance.checkNameAvailability(
                clientAccount.name
            );

        if (!isNameAvailable && clientAccount.name !== '') {
            return new HttpResponse(HttpStatusCode.CONFLICT, {
                success: false,
                message: 'Client account name already exists',
            });
        } else {
            const response =
                await ClientAccountRepository.defaultInstance.updateClientAccountHeader(
                    clientAccount
                );

            return new HttpResponse(HttpStatusCode.OK, {
                success: true,
                message: 'Client account successfully updated.',
                data: response,
            });
        }
    };

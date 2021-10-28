import {
    AsyncLambdaMiddleware,
    HttpResponse,
    HttpStatusCode,
} from '@dodsgroup/dods-lambda';

import { ClientAccountRepository } from '../../repositories/ClientAccountRepository';
import { UpdateClientAccountParameters } from '../../domain';

export const updateClientAccount: AsyncLambdaMiddleware<UpdateClientAccountParameters> =
    async (clientAccount) => {
        if (!clientAccount.contractRollover) {
            if (!clientAccount.contractEndDate) {
                return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                    success: false,
                    message: 'Must provide contract end Date',
                });
            }

            const contractEndDate = new Date(clientAccount.contractEndDate);
            const contractStartDate = new Date(clientAccount.contractStartDate);

            const dateDiff = Math.round(
                contractEndDate.getTime() - contractStartDate.getTime()
            );

            if (dateDiff <= 0) {
                return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                    success: false,
                    message: 'End date must be greater than start date',
                });
            }
        }

        await ClientAccountRepository.defaultInstance.UpdateCompletion(
            clientAccount.clientAccountId,
            false,
            2
        );

        const response =
            await ClientAccountRepository.defaultInstance.updateClientAccount(
                clientAccount
            );

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Client account successfully updated.',
            data: response,
        });
    };

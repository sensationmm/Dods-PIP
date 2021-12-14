import {
    AsyncLambdaMiddleware,
    HttpResponse,
    HttpStatusCode,
} from '@dodsgroup/dods-lambda';

import { ClientAccountRepository } from '../../repositories/ClientAccountRepository';
import { GetClientAccountParameters } from '../../domain';

export const getRemainingSeats: AsyncLambdaMiddleware<GetClientAccountParameters> =
    async (parameters) => {
        const clientAccountUsers =
            await ClientAccountRepository.defaultInstance.getClientAccountOccupiedSeats(
                parameters.clientAccountId
            );

        const clientAccountSuscriptedSeats: any =
            await ClientAccountRepository.defaultInstance.getClientAccountSeats(
                parameters.clientAccountId
            );
        const availableSeats: number =
            clientAccountSuscriptedSeats - clientAccountUsers;

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: `Remaining Seats ${availableSeats}`,
            data: availableSeats,
        });
    };

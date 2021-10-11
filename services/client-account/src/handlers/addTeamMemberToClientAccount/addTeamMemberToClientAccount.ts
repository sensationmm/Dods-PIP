import {
    AsyncLambdaMiddleware,
    HttpError,
    HttpResponse,
    HttpStatusCode,
} from '@dodsgroup/dods-lambda';

import { ClientAccountRepository } from '../../repositories';
import { ClientAccountTeamParameters } from '../../domain/interfaces/ClientAccountTeam';
import { ClientAccountTeamRepository } from '../../repositories/ClientAccountTeamRepository';

export const addTeamMemberToClientAccount: AsyncLambdaMiddleware<ClientAccountTeamParameters> =
    async ({ clientAccountTeam }) => {
        const clientAccount =
            await ClientAccountRepository.defaultInstance.findOne({
                id: clientAccountTeam.clientAccountId,
            });

        let clientAccountTeams = 0;

        if (clientAccount) {
            clientAccountTeams =
                await ClientAccountRepository.defaultInstance.getClientAccountUsers(
                    clientAccount.uuid
                );
        }

        if (
            clientAccount &&
            clientAccount.subscription_seats !== undefined &&
            clientAccount?.subscription_seats - clientAccountTeams < 1
        ) {
            throw new HttpError(
                'Client Account has not enough available seats',
                HttpStatusCode.FORBIDDEN
            );
        }

        await ClientAccountTeamRepository.defaultInstance.create(
            clientAccountTeam
        );

        await ClientAccountRepository.defaultInstance.UpdateCompletion(
            clientAccount.uuid,
            true,
            3
        );

        // await ClientAccountRepository.defaultInstance.updateClientAcount({ clientAccountId, subscription_seats: clientAccount.subscription_seats! - 1 })

        return new HttpResponse(HttpStatusCode.OK, {
            sucess: true,
            message: 'Team member was added to the client account.',
            data: clientAccountTeam,
        });
    };

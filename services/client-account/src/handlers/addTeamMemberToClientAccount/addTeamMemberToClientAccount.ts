import { AsyncLambdaMiddleware, HttpError, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { ClientAccountTeamParameters } from '../../domain/interfaces/ClientAccountTeam';
import { ClientAccountRepository } from '../../repositories';
import { ClientAccountTeamRepository } from '../../repositories/ClientAccountTeamRepository';

export const addTeamMemberToClientAccount: AsyncLambdaMiddleware<ClientAccountTeamParameters> =
    async ({ clientAccountTeam }) => {

        const clientAccount = await ClientAccountRepository.defaultInstance.findOne({ id: clientAccountTeam.clientAccountId });

        if (clientAccount && clientAccount.subscription_seats && clientAccount.subscription_seats < 1) {
            throw new HttpError("Client Account has not enough available seats", HttpStatusCode.FORBIDDEN);
        }

        await ClientAccountTeamRepository.defaultInstance.create(clientAccountTeam);

        // await ClientAccountRepository.defaultInstance.updateClientAcount({ clientAccountId, subscription_seats: clientAccount.subscription_seats! - 1 })

        return new HttpResponse(HttpStatusCode.OK, {
            sucess: true,
            message: 'Team member was added to the client account.',
            data: clientAccountTeam,
        });
    };

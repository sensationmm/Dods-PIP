import { AsyncLambdaMiddleware, HttpError, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { ClientAccountRepository, ClientAccountTeamRepository, UserProfileRepository } from '../../repositories';
import { ClientAccountTeamParameters } from '../../domain';

export const addTeamMemberToClientAccount: AsyncLambdaMiddleware<ClientAccountTeamParameters> =
    async ({ clientAccountTeam }) => {

        const clientAccount = await ClientAccountRepository.defaultInstance.findOne({ uuid: clientAccountTeam.clientAccountUuid });

        const clientAccountTeams = await ClientAccountRepository.defaultInstance.getClientAccountUsers(clientAccount.uuid);

        const { subscriptionSeats = 0 } = clientAccount;

        if (subscriptionSeats - clientAccountTeams < 1) {
            throw new HttpError('Client Account has not enough available seats', HttpStatusCode.FORBIDDEN);
        }

        const userProfile = await UserProfileRepository.defaultInstance.findOne({ uuid: clientAccount.uuid });

        await ClientAccountTeamRepository.defaultInstance.create({ clientAccountId: clientAccount.id, userId: userProfile.id, teamMemberType: clientAccountTeam.teamMemberType });

        await ClientAccountRepository.defaultInstance.UpdateCompletion(clientAccount.uuid, true, 3);

        return new HttpResponse(HttpStatusCode.OK, {
            sucess: true,
            message: 'Team member was added to the client account.',
            data: clientAccountTeam,
        });
    };

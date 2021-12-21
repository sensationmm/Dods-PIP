import {
    AsyncLambdaMiddleware,
    HttpError,
    HttpResponse,
    HttpStatusCode,
} from '@dodsgroup/dods-lambda';
import {
    ClientAccountRepository,
    ClientAccountTeamRepository,
    UserProfileRepository,
} from '../../repositories';
import { ClientAccountTeamParameters, TeamMemberTypes } from '../../domain';

export const addTeamMemberToClientAccount: AsyncLambdaMiddleware<ClientAccountTeamParameters> =
    async (clientAccountTeamMembers) => {
        var TeamsUuid = clientAccountTeamMembers.teamMembers.map(function (item) {
            return item['userId'];
        });
        const isDuplicated = TeamsUuid.filter((item, index) => TeamsUuid.indexOf(item) != index);

        if (isDuplicated.length > 0) {
            return new HttpResponse(HttpStatusCode.OK, {
                sucess: false,
                message: 'The same user cannot be saved multiple times.',
            });
        }

        await ClientAccountRepository.defaultInstance.deleteClientAccountTeamMembers(
            clientAccountTeamMembers.clientAccountId
        );

        const clientAccount = await ClientAccountRepository.defaultInstance.findOne({
            uuid: clientAccountTeamMembers.clientAccountId,
        });

        const occupiedSeats =
            await ClientAccountRepository.defaultInstance.getClientAccountOccupiedSeats(
                clientAccountTeamMembers.clientAccountId
            );

        const { subscriptionSeats = 0 } = clientAccount;

        if (
            subscriptionSeats - occupiedSeats <=
            clientAccountTeamMembers.teamMembers.filter(
                (teamMember) =>
                    teamMember.teamMemberType === TeamMemberTypes.ClientUser && teamMember.isActive
            ).length
        ) {
            throw new HttpError(
                'Client Account has not enough available seats',
                HttpStatusCode.FORBIDDEN
            );
        }

        await Promise.all(
            clientAccountTeamMembers.teamMembers.map(async (user) => {
                const userProfile = await UserProfileRepository.defaultInstance.findOne({
                    uuid: user.userId,
                });

                await ClientAccountTeamRepository.defaultInstance.create({
                    clientAccountId: clientAccount.id,
                    userId: userProfile.id,
                    teamMemberType: user.teamMemberType,
                });
            })
        );

        await ClientAccountRepository.defaultInstance.UpdateCompletion(clientAccount.uuid, true, 3);

        const teamMembers = await ClientAccountRepository.defaultInstance.getClientAccountTeam(
            clientAccountTeamMembers.clientAccountId
        );

        return new HttpResponse(HttpStatusCode.OK, {
            sucess: true,
            message: 'Team members were added to the client account.',
            data: teamMembers,
        });
    };

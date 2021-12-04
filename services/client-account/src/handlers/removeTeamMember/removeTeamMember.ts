import { AsyncLambdaMiddleware, HttpResponse, HttpStatusCode, } from '@dodsgroup/dods-lambda';
import { ClientAccountRepositoryV2, ClientAccountTeamRepositoryV2, IamRepository, UserProfileRepository, } from '../../repositories';
import { RemoveTeamMemberParameters, TeamMemberTypes } from '../../domain';

export const removeTeamMember: AsyncLambdaMiddleware<RemoveTeamMemberParameters> =
    async ({ userId, clientAccountId }) => {
        const clientAccount = await ClientAccountRepositoryV2.defaultInstance.findOne({ uuid: clientAccountId, });

        const user = await UserProfileRepository.defaultInstance.findOne({ uuid: userId, });

        const clientAccountTeam = await ClientAccountTeamRepositoryV2.defaultInstance.findOne({ userId: user.id, clientAccountId: clientAccount.id, });

        if (clientAccountTeam.teamMemberType === TeamMemberTypes.ClientUser) {
            await IamRepository.defaultInstance.destroyUser({ email: user.primaryEmail, });

            await UserProfileRepository.defaultInstance.updateUser({ isActive: false }, { id: user.id });
        }

        await ClientAccountTeamRepositoryV2.defaultInstance.delete({ clientAccountId: clientAccount.id, userId: user.id, });

        await ClientAccountRepositoryV2.defaultInstance.incrementSubscriptionSeats({ id: clientAccount.id });

        return new HttpResponse(HttpStatusCode.OK, { success: true, message: 'Team member successfully removed.', });
    };

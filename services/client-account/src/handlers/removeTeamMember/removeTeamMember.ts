import { AsyncLambdaMiddleware, HttpResponse, HttpStatusCode, } from '@dodsgroup/dods-lambda';
import { ClientAccountRepositoryV2, ClientAccountTeamRepository, UserProfileRepository, IamRepository, } from '../../repositories';
import { RemoveTeamMemberParameters, TeamMemberTypes, } from '../../domain';

export const removeTeamMember: AsyncLambdaMiddleware<RemoveTeamMemberParameters> =
    async ({ userId, clientAccountId }) => {

        const clientAccount = await ClientAccountRepositoryV2.defaultInstance.findOne({ uuid: clientAccountId });

        const user = await UserProfileRepository.defaultInstance.findOne({ uuid: userId });

        const clientAccountTeam = await ClientAccountTeamRepository.defaultInstance.findOne({ userId: user.id, clientAccountId: clientAccount.id });

        if (clientAccountTeam.teamMemberType === TeamMemberTypes.ClientUser) {
            await IamRepository.defaultInstance.destroyUser({ email: user.primaryEmail })

            await UserProfileRepository.defaultInstance.updateUser({ isActive: false }, { id: user.id });
        }

        await ClientAccountTeamRepository.defaultInstance.delete({ clientAccountId: clientAccount.id, userId: user.id })

        await ClientAccountRepositoryV2.defaultInstance.incrementSubscriptionSeat({ id: clientAccount.id });

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Team member successfully removed.',
            // data: {},
        });
    };

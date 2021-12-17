import { AsyncLambdaMiddleware, HttpResponse, HttpStatusCode, } from '@dodsgroup/dods-lambda';
import { ClientAccountRepositoryV2, ClientAccountTeamRepositoryV2, IamRepository, UserProfileRepository, } from '../../repositories';

import { RemoveTeamMemberParameters } from '../../domain';
import { UserProfileRepositoryV2 } from '../../repositories/UserProfileRepositoryV2';

export const removeTeamMember: AsyncLambdaMiddleware<RemoveTeamMemberParameters> =
    async ({ userId, clientAccountId }) => {
        const clientAccount = await ClientAccountRepositoryV2.defaultInstance.findOne({ uuid: clientAccountId, });

        const user = await UserProfileRepository.defaultInstance.findOne({ uuid: userId, });

        await IamRepository.defaultInstance.destroyUser({ email: user.primaryEmail, });

        await ClientAccountTeamRepositoryV2.defaultInstance.delete({ clientAccountId: clientAccount.id, userId: user.id, });

        await UserProfileRepositoryV2.defaultInstance.deleteUser(userId);

        await ClientAccountRepositoryV2.defaultInstance.incrementSubscriptionSeats({ id: clientAccount.id });

        return new HttpResponse(HttpStatusCode.OK, { success: true, message: 'Team member successfully removed.', });
    };

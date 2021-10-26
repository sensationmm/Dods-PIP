import {
    AsyncLambdaMiddleware,
    HttpError,
    HttpResponse,
    HttpStatusCode,
} from '@dodsgroup/dods-lambda';

import { ClientAccountRepository } from '../../repositories';
import { NewTeamMemberParameters } from '../../domain/interfaces/ClientAccountTeam';
import { UserProfileRepository } from '../../../../user-profile/src/repositories/UserProfileRepository';

export const createTeamMember: AsyncLambdaMiddleware<NewTeamMemberParameters> = async ({
    teamMemberType,
    userProfile,
    clientAccountId,
}) => {
    const availableSeats =
        await ClientAccountRepository.defaultInstance.getClientAccountAvailableSeats(
            clientAccountId
        );

    if (availableSeats < 1) {
        throw new HttpError(
            'Client Account has not enough available seats',
            HttpStatusCode.FORBIDDEN
        );
    }

    const newUser = await UserProfileRepository.defaultInstance.createUserProfile(userProfile);

    if (!newUser) {
        return new HttpResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, {
            success: false,
            message: 'Could not create User Profile',
        });
    }

    const userId = newUser.id;

    const response = await ClientAccountRepository.defaultInstance.addTeamMember({
        clientAccountId,
        userId,
        teamMemberType,
    });

    await ClientAccountRepository.defaultInstance.UpdateCompletion(clientAccountId, true, 3);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Team member was created and added to the client account.',
        data: response,
    });
};

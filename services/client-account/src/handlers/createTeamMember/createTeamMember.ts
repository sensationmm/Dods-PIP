import {
    AsyncLambdaMiddleware,
    HttpError,
    HttpResponse,
    HttpStatusCode,
} from '@dodsgroup/dods-lambda';
import {
    ClientAccountRepository,
    UserProfileRepository,
} from '../../repositories';

import { NewTeamMemberParameters } from '../../domain/interfaces/ClientAccountTeam';
import { TeamMemberTypes } from '../../domain';

export const createTeamMember: AsyncLambdaMiddleware<NewTeamMemberParameters> = async ({
    teamMemberType,
    userProfile,
    clientAccountId,
}) => {
    const isPrimaryEmailAvailable =
        await UserProfileRepository.defaultInstance.checkUserEmailAvailability(
            userProfile.primary_email_address
        );

    if (!isPrimaryEmailAvailable) {
        return new HttpResponse(HttpStatusCode.CONFLICT, {
            success: false,
            message: `A User already exists with the email: ${userProfile.primary_email_address}`,
        });
    }

    const availableSeats =
        await ClientAccountRepository.defaultInstance.getClientAccountAvailableSeats(
            clientAccountId
        );

    if (availableSeats < 1 && teamMemberType === TeamMemberTypes.ClientUser) {
        throw new HttpError(
            'Client Account has not enough available seats',
            HttpStatusCode.FORBIDDEN
        );
    }

    const createUserResponse = await UserProfileRepository.defaultInstance.createUser({
        title: userProfile.title,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        primaryEmail: userProfile.primary_email_address,
        roleId: userProfile.role_id,
        secondaryEmail: userProfile.secondary_email_address,
        telephoneNumber1: userProfile.telephone_number_1,
        telephoneNumber2: userProfile.telephone_number_2,
        clientAccountId,
    });

    if (!createUserResponse) {
        return new HttpResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, {
            success: false,
            message: 'Could not create User Profile',
        });
    }

    const userId = createUserResponse.data.uuid;

    await ClientAccountRepository.defaultInstance.addTeamMember({
        clientAccountId,
        userId,
        teamMemberType,
    });

    await ClientAccountRepository.defaultInstance.UpdateCompletion(clientAccountId, true, 3);

    if (createUserResponse.success) {
        console.log(createUserResponse.data);
    }

    const teamMembers = await ClientAccountRepository.defaultInstance.getClientAccountTeam(
        clientAccountId
    );

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Team member was created and added to the client account.',
        data: teamMembers,
    });
};

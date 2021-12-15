import { AsyncLambdaMiddleware, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { ClientAccountServiceRepository, UserProfileRepositoryV2 } from '../../repositories';
import { TeamMemberTypes, UpdateUserInput, UserProfileError } from '../../domain';

import { IamRepository } from '../../repositories/IamRepository';

export const updateUser: AsyncLambdaMiddleware<UpdateUserInput> = async (parameters) => {
    try {
        const { isActive } = parameters;
        const user = await UserProfileRepositoryV2.defaultInstance.getUser({
            userId: parameters.userId,
        });

        if (!user) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: `Error: Can not find user with uuid: ${parameters.userId}`,
            });
        }

        if (isActive === true) {
            if (user.clientAccount.teamMemberType === TeamMemberTypes.ClientUser) {
                const availableSeats =
                    await ClientAccountServiceRepository.defaultInstance.getRemainingSeats(
                        user.clientAccount.uuid!
                    );
                if (availableSeats < 1) {
                    return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                        success: false,
                        message: `Error: Can not activate user because Client Account: ${user.clientAccount.uuid} does not have enough seats.`,
                    });
                }
            }

            await IamRepository.defaultInstance.enableUser(user.primaryEmail);
        } else if (isActive === false) {
            await IamRepository.defaultInstance.disableUser(user.primaryEmail);
        }

        const response = await UserProfileRepositoryV2.defaultInstance.updateUser(parameters);

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'User updated successfully',
            user: {
                uuid: response.uuid,
                title: response.title,
                firstName: response.firstName,
                lastName: response.lastName,
                primaryEmail: response.primaryEmail,
                secondaryEmail: response.secondaryEmail,
                telephoneNumber1: response.telephoneNumber1,
                telephoneNumber2: response.telephoneNumber2,
                isActive: response.isActive,
            },
        });
    } catch (error: any) {
        if (error.response) {
            return new HttpResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, {
                success: false,
                message: `Cognito Error: ${JSON.stringify(error.response.data.error)}`,
            });
        }
        if (error instanceof UserProfileError) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: error.message,
            });
        }
        throw error;
    }
};

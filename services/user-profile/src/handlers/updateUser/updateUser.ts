import { AsyncLambdaMiddleware, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { UpdateUserInput, UserProfileError } from '../../domain';

import { IamRepository } from '../../repositories/IamRepository';
import { UserProfileRepositoryV2 } from '../../repositories';

export const updateUser: AsyncLambdaMiddleware<UpdateUserInput> = async (parameters) => {
    try {
        const { isActive } = parameters;
        const response = await UserProfileRepositoryV2.defaultInstance.updateUser(parameters);

        if (isActive === true) {
            await IamRepository.defaultInstance.enableUser(response.primaryEmail);
        } else if (isActive === false) {
            await IamRepository.defaultInstance.disableUser(response.primaryEmail);
        }

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

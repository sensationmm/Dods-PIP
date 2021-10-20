import { AsyncLambdaMiddleware, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { UserProfileRepository } from '../../repositories';
import { components } from '../../domain';

type CreateUserProfileParameters = components['schemas']['UserProfileCreate'];

export const createUserProfile: AsyncLambdaMiddleware<CreateUserProfileParameters> = async (
    parameters
) => {
    const newUserProfile = await UserProfileRepository.defaultInstance.createUserProfile(
        parameters
    );

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'User Profile successfully created.',
        data: newUserProfile,
    });
};

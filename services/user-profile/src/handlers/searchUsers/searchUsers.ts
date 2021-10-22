import { AsyncLambdaMiddleware, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { SearchUsersInput } from '../../domain';
import { UserProfileRepository } from '../../repositories';

export const searchUsers: AsyncLambdaMiddleware<SearchUsersInput> = async (parameters) => {

    const response = await UserProfileRepository.defaultInstance.searchUsers(parameters);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'User Profile List',
        data: response,
    });
};

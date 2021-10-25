import { AsyncLambdaMiddleware, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { SearchUsersInput } from '../../domain';
import { UserProfileRepositoryV2 } from '../../repositories';

export const searchUsers: AsyncLambdaMiddleware<SearchUsersInput> = async (parameters) => {

    const response = await UserProfileRepositoryV2.defaultInstance.searchUsers(parameters);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'User Profile List',
        data: response,
    });
};

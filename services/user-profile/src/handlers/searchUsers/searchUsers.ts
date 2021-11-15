import { AsyncLambdaMiddleware, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { SearchUsersInput } from '../../domain';
import { UserProfileRepositoryV2, LAST_NAME_COLUMN, ASC } from '../../repositories';

export const searchUsers: AsyncLambdaMiddleware<SearchUsersInput> = async (parameters) => {

    if (!parameters.limit) {
        parameters.limit = 30;
    }

    if (!parameters.offset) {
        parameters.offset = 0;
    }

    if (!parameters.sortBy) {
        parameters.sortBy = LAST_NAME_COLUMN;
    }

    if (!parameters.sortDirection) {
        parameters.sortDirection = ASC;
    }

    const response = await UserProfileRepositoryV2.defaultInstance.searchUsers(parameters);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'User Profile List',
        limit: parameters.limit,
        offset: parameters.offset,
        totalRecords: response.count,
        data: response.users,
    });
};

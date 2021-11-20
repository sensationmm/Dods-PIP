import { AsyncLambdaMiddleware, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { GetUserInput } from '../../domain';
import { UserProfileRepositoryV2 } from '../../repositories';

export const getUser: AsyncLambdaMiddleware<GetUserInput> = async (parameters) => {

    const response = await UserProfileRepositoryV2.defaultInstance.getUser(parameters);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'User Profile Found',
        data: response,
    });
};

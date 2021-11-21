import { AsyncLambdaMiddleware, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { CreateUserInput, UserProfileError } from '../../domain';
import { UserProfileRepositoryV2 } from '../../repositories';
import { IamRepository } from '../../repositories/IamRepository';

export const createUser: AsyncLambdaMiddleware<CreateUserInput> = async (parameters) => {

    const { primaryEmail, clientAccountId, clientAccountName } = parameters;
    let userId;

    try {
        const createUserResult = await IamRepository.defaultInstance.createUser(primaryEmail, clientAccountId, clientAccountName);

        if (createUserResult.success) {
            userId = createUserResult.data.userName;
        } else {
            throw new UserProfileError('Cognito Error: User is not created');
        }
    } catch (error: any) {

        if (error.response) {
            throw new UserProfileError(`Cognito Error: ${JSON.stringify(error.response.data.error)}`);
        }
        throw error;
    }

    const response = await UserProfileRepositoryV2.defaultInstance.createUser(parameters);

    await IamRepository.defaultInstance.updateUserAttributes(primaryEmail, [{ Name: 'custom:UserProfileUuid', Value: response.uuid }]);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'User was created succesfully',
        User: {
            displayName: response.fullName,
            userName: response.primaryEmail,
            emailAddress: response.primaryEmail,
            userId,
            role: parameters.roleName,
            clientAccount: {
                id: clientAccountId,
                name: clientAccountName
            }
        },
    });
};

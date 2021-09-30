import { AsyncLambdaMiddleware, HttpStatusCode, HttpResponse } from '@dodsgroup/dods-lambda';
import { ClientAccountParameters } from '../../domain';
import { ClientAccountRepository } from '../../repositories';
import { ValidationError } from 'sequelize';

export const createClientAccount: AsyncLambdaMiddleware<ClientAccountParameters> = async ({ clientAccount }) => {
    try {
        const newClientAccount = await ClientAccountRepository.defaultInstance.createClientAccount(clientAccount);

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Client account successfully created.',
            data: newClientAccount,
        });
    } catch (error) {
        console.error('Error creating client account:', error);

        if (error instanceof ValidationError) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: 'Error creating client account.',
                errors: error.errors,
            });
        }

        return new HttpResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, {
            success: false,
            message: 'Error creating client account.',
            error,
        });
    }
};

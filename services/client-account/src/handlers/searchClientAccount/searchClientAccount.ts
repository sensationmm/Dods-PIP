import { Logger, AsyncLambdaMiddleware, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { ValidationError } from 'sequelize';
import { ClientAccountRepository } from '../../repositories';
import { SearchClientAccountParameters } from '../../domain';

export const searchClientAccount: AsyncLambdaMiddleware<SearchClientAccountParameters> = async (params) => {
    try {
        const response = await ClientAccountRepository.defaultInstance.searchClientAccount(params);

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Showing Results.',
            limit: params?.limit,
            offset: params?.offset,
            data: response,
        });
    } catch (error) {
        Logger.error('Error searching client accounts:', error);

        if (error instanceof ValidationError) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: 'Error searching client accounts.',
                errors: error.errors,
            });
        }

        return new HttpResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, {
            success: false,
            message: 'Error searching client accounts.',
            error,
        });
    }
};

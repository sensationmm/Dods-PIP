import {
    ClientAccountParameters,
    HttpBadRequestResponse,
    HttpInternalServerErrorResponse,
    HttpSuccessResponse,
} from '../../domain';

import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ClientAccountRepository } from '../../repositories/ClientAccountRepository';
import { ValidationError } from 'sequelize';

export const createClientAccount = async ({
    clientAccount,
}: {
    clientAccount: ClientAccountParameters;
}): Promise<APIGatewayProxyResultV2> => {
    try {
        const newClientAccount =
            await ClientAccountRepository.defaultInstance.createClientAccount(
                clientAccount
            );

        return new HttpSuccessResponse({
            success: true,
            message: 'Client account successfully created.',
            data: newClientAccount,
        });
    } catch (error) {
        console.error('Error creating client account:', error);

        if (error instanceof ValidationError) {
            return new HttpBadRequestResponse({
                success: false,
                message: 'Error creating client account.',
                errors: error.errors,
            });
        }

        return new HttpInternalServerErrorResponse({
            success: false,
            message: 'Error creating client account.',
            error,
        });
    }
};

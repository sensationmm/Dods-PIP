import { APIGatewayProxyResultV2 } from 'aws-lambda';
import { ClientAccountRepository } from '../../repositories/ClientAccountRepository';
import { SearchClientAccountParameters, HttpSuccessResponse, HttpBadRequestResponse, HttpInternalServerErrorResponse } from '../../domain';
import { ValidationError } from 'sequelize';

// export const searchClientAccount = async ({ clientAccountId, }: { clientAccountId: string; }): Promise<APIGatewayProxyResultV2> => {
export const searchClientAccount = async (params: SearchClientAccountParameters): Promise<APIGatewayProxyResultV2> =>
{
    try {
        const response = await ClientAccountRepository.defaultInstance.searchClientAccount(params);

        return new HttpSuccessResponse(
            {
                success: true,
                message: 'Showing Results.',
                limit: params?.limit,
                offset: params?.offset,
                data: response,
            }
        );
    } catch (error) {
        console.error('Error searching client accounts:', error);
        if (error instanceof ValidationError) {
            return new HttpBadRequestResponse({
                success: false,
                message: 'Error searching client accounts.',
                errors: error.errors,
            });
        }
        return new HttpInternalServerErrorResponse({
            success: false,
            message: 'Error searching client accounts.',
            error,
        });
    }

};

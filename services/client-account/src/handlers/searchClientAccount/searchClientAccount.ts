import {
    AsyncLambdaMiddleware,
    HttpResponse,
    HttpStatusCode,
} from '@dodsgroup/dods-lambda';

import { ClientAccountRepository } from '../../repositories';
import { SearchClientAccountParameters } from '../../domain';

export const searchClientAccount: AsyncLambdaMiddleware<SearchClientAccountParameters> =
    async (params) => {
        const response =
            await ClientAccountRepository.defaultInstance.searchClientAccount(
                params
            );

        if (response?.length == 0) {
            return new HttpResponse(HttpStatusCode.NOT_FOUND, {
                success: false,
                message: `No matches found for search parameters: ${params}`,
            });
        }

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Showing Results.',
            limit: params?.limit,
            offset: params?.offset,
            totalRecords: response?.length,
            data: response,
        });
    };

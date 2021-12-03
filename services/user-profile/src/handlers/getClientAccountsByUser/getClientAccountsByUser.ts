import {
    ASC,
    CLIENT_ACCOUNT_NAME,
    UserProfileRepositoryV2,
} from '../../repositories';
import {
    AsyncLambdaMiddleware,
    HttpResponse,
    HttpStatusCode,
} from '@dodsgroup/dods-lambda';

import { GetUserClientAccounts } from '../../domain';

export const getClientAccountsByUser: AsyncLambdaMiddleware<GetUserClientAccounts> =
    async (parameters) => {
        if (!parameters.limit) {
            parameters.limit = '30';
        }

        if (!parameters.offset) {
            parameters.offset = '0';
        }

        if (!parameters.sortBy) {
            parameters.sortBy = CLIENT_ACCOUNT_NAME;
        }

        if (!parameters.sortDirection) {
            parameters.sortDirection = ASC;
        }
        const response =
            await UserProfileRepositoryV2.defaultInstance.getUserClientAccounts(
                parameters
            );

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Showing Results.',
            limit: parameters.limit,
            offset: parameters.offset,
            totalRecords: response.totalRecords,
            filteredRecords: response.filteredRecords,
            data: response.clients,
        });
    };

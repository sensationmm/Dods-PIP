import {
    AsyncLambdaMiddleware,
    HttpResponse,
    HttpStatusCode,
} from '@dodsgroup/dods-lambda';

import { ClientAccountRepository } from '../../repositories';
import { SearchClientAccountParameters } from '../../domain';

export const searchClientAccount: AsyncLambdaMiddleware<SearchClientAccountParameters> =
    async (params) => {
        let limitNum = params.limit ? parseInt(params.limit) : 20;
        let offsetNum = params.offset ? parseInt(params.offset) : 0;

        params.limitNum = limitNum;
        params.offsetNum = offsetNum;
        const response =
            await ClientAccountRepository.defaultInstance.searchClientAccount(
                params
            );

        if (response?.clientAccountsData?.length == 0) {
            return new HttpResponse(HttpStatusCode.NOT_FOUND, {
                success: false,
                message: `No matches found for search parameters: ${params}`,
            });
        }

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Showing Results.',
            limit: params?.limitNum,
            offset: params?.offsetNum,
            totalRecords: response?.totalRecordsModels,
            data: response?.clientAccountsData,
        });
    };

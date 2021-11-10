import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { EditorialRecordRepository } from '../../repositories/EditorialRecordRepository';
import { SearchEditorialRecordParameters } from '../../domain';

export const searchEditorialRecords: AsyncLambdaHandler<SearchEditorialRecordParameters> = async (
    params
) => {
    // Default page and page size if not defined
    params.page = params.page || '1';
    params.pageSize = params.pageSize || '20';

    const foundRecords = await EditorialRecordRepository.defaultInstance.listEditorialRecords(
        params
    );
    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Editorial Records Found',
        data: foundRecords,
    });
};

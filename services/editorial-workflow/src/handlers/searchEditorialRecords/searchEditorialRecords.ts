import {
    AsyncLambdaHandler,
    HttpResponse,
    HttpStatusCode,
} from '@dodsgroup/dods-lambda';

import { EditorialRecordRepository } from '../../repositories/EditorialRecordRepository';
import { SearchEditorialRecordParameters } from '../../domain';

export const searchEditorialRecords: AsyncLambdaHandler<SearchEditorialRecordParameters> =
    async (params) => {
        // Default page and page size if not defined
        params.offset = params.offset || '0';
        params.limit = params.limit || '20';

        params.sortBy = params.sortBy || 'creationdate';
        params.sortDirection = params.sortDirection || 'asc';

        params.sortBy = params.sortBy.toLowerCase();
        params.sortDirection = params.sortDirection.toLowerCase();

        if (
            params.sortBy === 'documentname' ||
            params.sortBy === 'status' ||
            params.sortBy === 'creationdate'
        ) {
            if (params.sortBy === 'status') {
                params.sortBy = 'statusId';
            } else if (params.sortBy === 'creationdate') {
                params.sortBy = 'createdAt';
            } else {
                params.sortBy = 'documentName';
            }
        }

        if (params.endDate && params.startDate) {
            const endDate = new Date(params.endDate);
            const startDate = new Date(params.startDate);

            if (endDate.getTime() - startDate.getTime() < 0) {
                return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                    success: false,
                    message: `End date must be greater than start date`,
                });
            }
        }

        const foundRecords =
            await EditorialRecordRepository.defaultInstance.listEditorialRecords(
                params
            );
        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Editorial Records Found',
            data: foundRecords,
        });
    };

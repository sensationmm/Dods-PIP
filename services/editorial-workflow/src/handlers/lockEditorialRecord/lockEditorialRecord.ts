import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { EditorialRecordRepository } from '@dodsgroup/dods-repositories';

import { BadParameterError, LockEditorialRecordParameters } from '../../domain';

export const lockEditorialRecord: AsyncLambdaHandler<LockEditorialRecordParameters> = async (params) => {
    try {
        const updatedRecord = await EditorialRecordRepository.defaultInstance.lockEditorialRecord(
            params
        );
        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Editorial Record locked.',
            data: updatedRecord,
        });
    } catch (error) {
        if (error instanceof BadParameterError) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: error.message,
                //* Add record to response if there is one.
                ...(error.editorialRecord && { data: error.editorialRecord }),
            });
        } else {
            throw error;
        }
    }
};

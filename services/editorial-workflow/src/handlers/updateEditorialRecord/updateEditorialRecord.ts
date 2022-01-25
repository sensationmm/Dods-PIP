import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { EditorialRecordRepository } from '@dodsgroup/dods-repositories';

import { BadParameterError, UpdateEditorialRecordParameters } from '../../domain';

export const updateEditorialRecord: AsyncLambdaHandler<UpdateEditorialRecordParameters> = async (params) => {
    try {
        const updatedRecord = await EditorialRecordRepository.defaultInstance.updateEditorialRecord(
            params
        );
        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Editorial Record updated.',
            data: updatedRecord,
        });
    } catch (error) {
        if (error instanceof BadParameterError) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: error.message,
            });
        } else {
            throw error;
        }
    }
};

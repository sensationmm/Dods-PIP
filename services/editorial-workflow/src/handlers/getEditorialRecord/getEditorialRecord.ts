import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { EditorialRecordRepository } from '@dodsgroup/dods-repositories';

import { BadParameterError } from '../../domain';

export const getEditorialRecord: AsyncLambdaHandler<{ recordId: string }> = async ({
    recordId,
}) => {
    try {
        const record = await EditorialRecordRepository.defaultInstance.getEditorialRecord(recordId);
        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Editorial Record found.',
            data: record,
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

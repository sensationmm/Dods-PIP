import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { CreateEditorialRecordParameters } from '../../domain';
import { EditorialRecordRepository } from '../../repositories/EditorialRecordRepository';

export const createEditorialRecord: AsyncLambdaHandler<CreateEditorialRecordParameters> = async (
    params
) => {
    const newRecord = await EditorialRecordRepository.defaultInstance.createEditorialRecord(params);
    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'New Editorial Record created.',
        data: newRecord,
    });
};

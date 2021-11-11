import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { EditorialRecordStatusesRepository } from '../../repositories/EditorialRecordStatusesRepository';

export const getEditorialRecordStatusList: AsyncLambdaHandler = async () => {
    const status = await EditorialRecordStatusesRepository.defaultInstance.getEditorialRecordStatuses();
    
    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        status: status,
    });
};

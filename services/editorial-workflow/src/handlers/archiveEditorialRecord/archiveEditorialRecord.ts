import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { EditorialRecordRepository, ArchiveEditorialRecordParameters } from '@dodsgroup/dods-repositories';

export const archiveEditorialRecord: AsyncLambdaHandler<ArchiveEditorialRecordParameters> = async (params) => {
    
    await EditorialRecordRepository.defaultInstance.archiveEditorialRecord(params);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Editorial Record archived',
    });
};

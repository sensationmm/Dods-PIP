import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { DocumentRepository, EditorialRecordRepository, UnscheduleEditorialRecordParamateres } from '@dodsgroup/dods-repositories';

import { config } from '../../domain';

const { dods: { downstreamEndpoints: { userProfile } } } = config;

const documentRepository = new DocumentRepository(userProfile);

export const unscheduleEditorialRecord: AsyncLambdaHandler<UnscheduleEditorialRecordParamateres> = async (params) => {
    const { recordId } = params;

    await EditorialRecordRepository.defaultInstance.unscheduleEditorialRecord(recordId);

    const deleteScheduleEditorialRecord: any = await documentRepository.deleteSchedule(recordId);

    if (deleteScheduleEditorialRecord.response.data.success) {
        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'The Editorial Record was unscheduled successfully',
        });
    }
    else {
        return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Not unscheduled Editorial Record',
        });

    }

};

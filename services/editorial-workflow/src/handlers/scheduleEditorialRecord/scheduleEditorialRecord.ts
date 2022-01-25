import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { DocumentPublishRepository } from '../../repositories/DocumentPublishRepository';
import { EditorialRecordRepository } from '../../repositories/EditorialRecordRepository';
import { ScheduleEditorialRecordParamateres } from '../../domain';

export const scheduleEditorialRecord: AsyncLambdaHandler<ScheduleEditorialRecordParamateres> = async (
    params,
) => {

    try {

        const schedulePublishingResponse: any = await DocumentPublishRepository.defaultInstance.scheduleWebhook(params);

        let editorialRecord = {}

        if (schedulePublishingResponse.response.data.success) {

            editorialRecord = await EditorialRecordRepository.defaultInstance.scheduleEditorialRecord(
                params
            );

            return new HttpResponse(HttpStatusCode.OK, {
                success: true,
                message: 'The Document publishing was scheduled successfully',
                editorialRecord: editorialRecord
            });

        }
        else {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: 'Error could not schedule the public of the document',
            });

        }

    } catch (error: any) {
        if (error) {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: error.message,
            });
        } else {
            throw error;
        }
    }

};

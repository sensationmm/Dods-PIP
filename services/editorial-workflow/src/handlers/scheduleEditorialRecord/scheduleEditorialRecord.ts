import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { DocumentRepository, EditorialRecordRepository, ScheduleEditorialRecordParamateres } from '@dodsgroup/dods-repositories';

import { config } from '../../domain';

const { dods: { downstreamEndpoints: { userProfile } } } = config;

const documentRepository = new DocumentRepository(userProfile);

export const scheduleEditorialRecord: AsyncLambdaHandler<ScheduleEditorialRecordParamateres> = async (params) => {

    try {

        const schedulePublishingResponse: any = await documentRepository.scheduleWebhook(params);

        let editorialRecord: any = {}

        if (schedulePublishingResponse.response.data.success) {

            editorialRecord = await EditorialRecordRepository.defaultInstance.scheduleEditorialRecord(params);

            let { s3Location, ...recordResponse } = editorialRecord;

            return new HttpResponse(HttpStatusCode.OK, {
                success: true,
                message: 'The Document publishing was scheduled successfully',
                editorialRecord: recordResponse
            });
        }
        else {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: 'Error could not schedule the public of the document',
            });
        }

    } catch (error: any) {
        return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: error.message,
        });
    }
};

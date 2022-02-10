import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { DocumentRepository, EditorialRecordRepository, ScheduleEditorialRecordParamateres } from '@dodsgroup/dods-repositories';

import { config } from '../../domain';
import { parseExpression as parser } from 'cron-parser'

const { dods: { downstreamEndpoints: { userProfile } } } = config;

const documentRepository = new DocumentRepository(userProfile);

export const scheduleEditorialRecord: AsyncLambdaHandler<ScheduleEditorialRecordParamateres> = async (params) => {

    const { cron, recordId } = params
    try {
        const record = await EditorialRecordRepository.defaultInstance.getEditorialRecord(recordId);

        if (record.status?.status === 'Scheduled') {

            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: `Error: Editorial Record with uuid: ${recordId} is already scheduled`
            });
        }

        const parserOptions = {
            currentDate: new Date(),
            iterator: false,
            tz: 'Europe/London'
        }

        const scheduleDate = parser(cron, parserOptions);
        const publishDate = new Date(scheduleDate.next().toString());

        const schedulePublishingResponse: any = await documentRepository.scheduleWebhook(params);

        let editorialRecord: any = {}

        if (schedulePublishingResponse.response.data.success) {

            const scheduleParameters = {
                ...params,
                date: publishDate
            }

            editorialRecord = await EditorialRecordRepository.defaultInstance.scheduleEditorialRecord(scheduleParameters);

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

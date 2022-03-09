import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { DocumentRepository, EditorialRecordRepository } from '@dodsgroup/dods-repositories';

import { BadParameterError } from '../../domain';
import { config } from '../../domain';

export const getEditorialRecord: AsyncLambdaHandler<{ recordId: string }> = async ({
    recordId,
}) => {
    const { dods: { downstreamEndpoints: { userProfile } } } = config;
    const { aws: { keys: { api_key } } } = config
    const documentRepository = new DocumentRepository(userProfile);

    try {

        const record = await EditorialRecordRepository.defaultInstance.getEditorialRecord(recordId);
        const response: any = await documentRepository.getDocument(record.s3Location, api_key);
        const document = response.response.data.payload;

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Editorial Record found.',
            data: {
                ...record,
                document
            },
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

import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { DocumentRepository, EditorialRecordRepository } from '@dodsgroup/dods-repositories';

import { config } from '../../domain';

const { dods: { downstreamEndpoints: { userProfile } } } = config;
const { aws: { keys: { api_key } } } = config
const documentRepository = new DocumentRepository(userProfile);

export const getEditorialRecordDocument: AsyncLambdaHandler<{ recordId: string }> = async ({ recordId }) => {

    try {
        const record = await EditorialRecordRepository.defaultInstance.getEditorialRecord(recordId);
        const documentARN = record.s3Location;
        const response: any = await documentRepository.getDocument(documentARN, api_key);

        const documentBody = response.response.data.payload;

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Document found',
            document: documentBody
        });


    } catch (error: any) {

        return new HttpResponse(HttpStatusCode.NOT_FOUND, {
            success: false,
            message: error.message,
        });
    }

};

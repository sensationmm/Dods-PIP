import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { DocumentServiceRepository } from '../../repositories/DocumentServiceRepository';
import { EditorialRecordRepository } from '../../repositories/EditorialRecordRepository';

export const getEditorialRecordDocument: AsyncLambdaHandler<{ recordId: string }> = async (
    { recordId }
) => {

    try {
        const record = await EditorialRecordRepository.defaultInstance.getEditorialRecord(recordId);
        const documentARN = record.s3Location;
        const response: any = await DocumentServiceRepository.defaultInstance.getDocument(documentARN);

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

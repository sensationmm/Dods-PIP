import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { DocumentStorageRepository } from '../../repositories';
import { getDocumentParameters } from '../../domain/interfaces';

export const getDocument: AsyncLambdaHandler<getDocumentParameters> = async (params) => {
    const documentARN = params.arn;

    const { success, payload } = await DocumentStorageRepository.defaultInstance.getDocumentByArn(
        documentARN
    );

    return success && payload
        ? new HttpResponse(HttpStatusCode.OK, {
              success: true,
              message: 'Document found.',
              payload: JSON.parse(payload),
          })
        : new HttpResponse(HttpStatusCode.INTERNAL_SERVER_ERROR, {
              success: false,
              message: 'Error retrieving document.',
          });
};

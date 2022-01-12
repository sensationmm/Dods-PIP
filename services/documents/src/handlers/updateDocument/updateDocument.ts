import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { DocumentStorageRepository } from '../../repositories';
import { updateDocumentParameters } from '../../domain/interfaces';

export const updateDocument: AsyncLambdaHandler<updateDocumentParameters> = async (params) => {

    const documentARN = params.arn;
    const receivedDocument = params.document;

    const { success, payload } = await DocumentStorageRepository.defaultInstance.getDocumentByArn(
        documentARN
    );

    if (success && payload) {
        const parsedOldDocument = JSON.parse(payload);
        const updatedDoc = Object.assign(parsedOldDocument, receivedDocument);

        const response = await DocumentStorageRepository.defaultInstance.updateDocumemt(documentARN, updatedDoc);

        if (response) {
            return new HttpResponse(HttpStatusCode.OK, {
                success: true,
                message: "Document Successfully Updated",
                payload: updatedDoc,
            })
        }
        else {
            return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
                success: false,
                message: "Imposible to Update Document",
            })
        }
    }

    else {

        return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: "Please Check the ARN of the Document",
        })

    }

};

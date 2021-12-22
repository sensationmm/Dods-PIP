import { getFromS3, putInS3 } from '../../utility/aws';

// import { AsyncLambdaHandler } from '@dodsgroup/dods-lambda';
import S3 from 'aws-sdk/clients/s3';
import { updateDocumentParameters } from '../../domain/interfaces';

const BUCKET = process.env.CONTENT_BUCKET || '';

export const updateDocument = async (data: updateDocumentParameters) => {
    // get documentId (UUID)
    const documentId = data['arn']; //* This does not work, needs refactoring
    // get document payload
    const receivedDocument = data['document'];
    const parsedNewDocument = JSON.parse(receivedDocument);

    // get current document content
    const getParams: S3.GetObjectRequest = {
        Bucket: BUCKET,
        Key: documentId,
    };
    const response = await getFromS3(getParams);

    var parsedOldDocument;

    if (!!response.Body) {
        parsedOldDocument = JSON.parse(response.Body.toString('utf-8'));
        console.log('parsedOldDocument :', parsedOldDocument);
    } else {
        throw new Error('Undefined response from storage when trying to get document');
    }

    // update included fields using received payload
    const updatedDoc = Object.assign(parsedOldDocument, parsedNewDocument);

    const putParams: S3.PutObjectRequest = {
        Body: JSON.stringify(updatedDoc),
        Bucket: BUCKET,
        Key: documentId,
    };
    await putInS3(putParams);
    return {
        success: true,
        document: updatedDoc,
    };
};

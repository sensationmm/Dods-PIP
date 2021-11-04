// import { AsyncLambdaHandler } from '@dodsgroup/dods-lambda';
import S3 from 'aws-sdk/clients/s3';
import { getFromS3 } from '../../utility/aws'
import { getDocumentParameters } from '../../domain/interfaces'

const BUCKET = process.env.CONTENT_BUCKET || ''

export const getDocument = async (data: getDocumentParameters) => {
    const documentId = data['documentId']

    const params: S3.GetObjectRequest = {
        Bucket: BUCKET,
        Key: documentId
    };
    const response = await getFromS3(params)
    
    var document

    if (!!response.Body) {
        document = JSON.parse(response.Body.toString('utf-8'))
    } else {
        throw new Error("Undefined response from storage when trying to get document");
    }
    return {
        success: true,
        document: document
    };
};
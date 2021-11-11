// import { AsyncLambdaHandler } from '@dodsgroup/dods-lambda';
import S3 from 'aws-sdk/clients/s3';
import { putInS3 } from '../../utility/aws'
import { v4 as uuidv4 } from 'uuid';
import Ajv from "ajv"

import { documentSchema } from '../../templates/'
import { CreateDocumentParameters } from '../../domain/interfaces'

const ajv = new Ajv()
const validate = ajv.compile(documentSchema)

const BUCKET = process.env.CONTENT_BUCKET || ''

export const createDocument = async (data: CreateDocumentParameters) => {
    // generate a name (documentId) for the file to be stored in S3
    const documentId = uuidv4();
    // get document payload
    const receivedDocument = data['document'];
    const parsedNewDocument = JSON.parse(receivedDocument);

    // validate received document schema
    const isValid = validate(parsedNewDocument)
    if (isValid) {
        const putParams: S3.PutObjectRequest = {
            Bucket: BUCKET,
            Key: documentId,
            Body: JSON.stringify(parsedNewDocument)
        }
        await putInS3(putParams)
        return {
            success: true,
            documentId: documentId,
            documentContent: parsedNewDocument
        };
    } else {
        throw validate.errors;
    }
};
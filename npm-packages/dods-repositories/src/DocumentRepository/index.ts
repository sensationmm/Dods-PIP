import { AwsService, DefaultAwsService } from '../shared/DefaultAwsService';
import { DocumentPayloadResponse, DocumentPayloadResponseV1, DocumentPersister, ScheduleAlertParameters, ScheduleWebhookParameters, createPercolatorParameters, searchContentParameters, updatePercolatorParameters } from './domain';
import { Lambda, S3 } from 'aws-sdk';

import { ScheduleEditorialRecordParamateres } from '../EditorialRecordRepository';
import axios from 'axios';

export * from './domain';

// const GET_DOCUMENT_LAMBDA = 'getDocument';
// const UPDATE_DOCUMENT_LAMBDA = 'updateDocument';

export class DocumentRepository implements DocumentPersister {

    static defaultInstance: DocumentPersister = new DocumentRepository('');

    constructor(
        private baseURL: string,
        private awsService: AwsService = DefaultAwsService.defaultInstance,
        // private getDocumentLambda = GET_DOCUMENT_LAMBDA,
        // private updateDocumentLambda = UPDATE_DOCUMENT_LAMBDA,
    ) { }

    async publishDocument(lambdaName: string, payload: string): Promise<boolean> {
        return this.awsService.invokeLambda(lambdaName, payload, false);
    }

    async updateDocument(parameters: any, key: string): Promise<Object> {
        const response = await axios.put(`${this.baseURL}documents`, parameters, { headers: { 'x-api-key': key } });
        const { data: { success, payload } } = response;
        return { success, payload };
    }

    async getDocument(documentARN: string, key: string): Promise<Object> {
        const response = await axios.get(`${this.baseURL}documents`, { params: { arn: documentARN }, headers: { 'x-api-key': key } });
        return { response };
    }

    // async updateDocument(parameters: any): Promise<Object> {
    //     return this.awsService.invokeLambda(this.updateDocumentLambda, parameters, { success: false });
    // }

    // async getDocument(documentARN: string): Promise<Object> {
    //     return this.awsService.invokeLambda(this.getDocumentLambda, documentARN, { success: false });
    // }

    async getDocumentByArn(documentARN: string): Promise<DocumentPayloadResponse> {

        const keyName = documentARN.substring(documentARN.indexOf("/") + 1, documentARN.length);
        const bucket = documentARN.substring(documentARN.lastIndexOf(":") + 1, documentARN.indexOf("/"))

        const content = await this.awsService.getFromS3(bucket, keyName);

        return { success: typeof content === 'string', payload: content };
    }

    async getDocumentByArnV1(documentARN: string): Promise<DocumentPayloadResponseV1> {

        let response: DocumentPayloadResponseV1 = { success: undefined, payload: undefined }


        const region = process.env.AWS_REGION
        const s3Client = new S3({ region: region });
        const keyName = documentARN.substring(documentARN.indexOf("/") + 1, documentARN.length);
        const bucket = documentARN.substring(documentARN.lastIndexOf(":") + 1, documentARN.indexOf("/"))
        const getFileParams = {
            Bucket: bucket,
            Key: keyName
        }

        let bucketErr = false;
        let errorCode;

        const content = await s3Client.getObject(getFileParams, function (err) {

            if (err) {
                errorCode = err.code;
                bucketErr = true;
            }

        }).promise();

        const documentContent = content.Body?.toString('utf-8');

        if (!bucketErr) {

            response = {
                success: true,
                payload: documentContent
            }
        }

        else {

            response = {
                success: false,
                payload: errorCode
            }
        }

        return response;


    }

    async scheduleWebhook(parameters: ScheduleEditorialRecordParamateres): Promise<object> {
        const scheduleWebhook: ScheduleWebhookParameters = { ...parameters, scheduleType: 'publish', scheduleId: parameters.recordId }
        const response = await axios.post(`${this.baseURL}/scheduler`, scheduleWebhook);
        return { response };
    }

    async scheduleAlertWebhook(parameters: ScheduleAlertParameters): Promise<object> {
        const response = await axios.post(`${this.baseURL}/scheduler/alert`, parameters);
        return { response };
    }

    async createPercolator(parameters: createPercolatorParameters): Promise<object> {
        const response = await axios.post(`${this.baseURL}/percolator`, parameters);
        return { response };
    }

    async updatePercolator(parameters: updatePercolatorParameters): Promise<object> {
        const { alertId } = parameters
        const response = await axios.put(`${this.baseURL}/percolator/${alertId}`, parameters);
        return { response };
    }

    async deletePercolator(alertId: string): Promise<object> {
        const response = await axios.delete(`${this.baseURL}/percolator/${alertId}`);
        return { response };
    }


    async deleteSchedule(recordId: string): Promise<object> {
        const response = await axios.delete(`${this.baseURL}/scheduler/${recordId}`);
        return { response };
    }

    async publishDocumentV1(lambdaName: string, payload: string): Promise<boolean> {

        const lambdaClient = new Lambda({ region: process.env.AWS_REGION });

        const lambdaReponse = await lambdaClient.invoke({ FunctionName: lambdaName, Payload: payload }, function (error, data) {
            if (error) {
                console.log(error);
            }
            if (data) {
                console.log(data);
            }
        }).promise();

        if (lambdaReponse.Payload === 'true') {
            return true
        }

        else {
            return false
        }

    }

    async sendEmail(parameters: any, baseURL: string, key: string): Promise<Object> {
        const response = await axios.post(`${baseURL}/email`, parameters, { headers: { 'x-api-key': key } });
        const { data: { success, data, error } } = response;
        return { success, data: data, error };
    }

    async getDocumentById(documentId: string, baseURL: string, key: string): Promise<Object> {
        const response = await axios.get(`${baseURL}/search/contents/internal/${documentId}`, { headers: { 'x-api-key': key } });
        const { data: { success, data, error } } = response;
        return { success, data: data, error };
    }

    async searchContent(parameters: searchContentParameters): Promise<object> {
        const { query, baseURL } = parameters;
        const response = await axios.post(`${baseURL}/search/contents/query`, query);
        return { response };
    }

    async autoTagContent(lambdaName: string, payload: string): Promise<Object> {

        const lambdaClient = new Lambda({ region: process.env.AWS_REGION });

        const lambdaResponse = await lambdaClient.invoke({ FunctionName: lambdaName, Payload: payload }, function (error, data) {
            if (error) {
                console.log(error);
            }
            if (data) {
                console.log(data);
            }
        }).promise();
        return lambdaResponse;

    }


}

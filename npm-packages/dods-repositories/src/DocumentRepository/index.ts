import axios from 'axios';
import { AwsService, DefaultAwsService } from '../shared/DefaultAwsService';
import { ScheduleEditorialRecordParamateres } from '../EditorialRecordRepository';
import { DocumentPayloadResponse, DocumentPersister, ScheduleWebhookParameters, } from './domain';

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

    async updateDocument(parameters: any): Promise<Object> {
        const response = await axios.put(`${this.baseURL}documents`, parameters);
        const { data: { success } } = response;
        return { success };
    }

    async getDocument(documentARN: string): Promise<Object> {
        const response = await axios.get(`${this.baseURL}documents`, { params: { arn: documentARN } });
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

    async scheduleWebhook(parameters: ScheduleEditorialRecordParamateres): Promise<object> {
        const scheduleWebhook: ScheduleWebhookParameters = { ...parameters, scheduleType: 'publish', scheduleId: parameters.recordId }
        const response = await axios.post(`${this.baseURL}/scheduler`, scheduleWebhook);
        return { response };
    }
}

import { DocumentParameters, ScheduleEditorialRecordParamateres } from "../EditorialRecordRepository";

export interface DocumentPayloadResponse {
    success: boolean;
    payload: string | Error;
}

export interface DocumentPayloadResponseV1 {
    success: boolean | undefined;
    payload: string | undefined;
}

export interface ScheduleWebhookParameters extends DocumentParameters {
    scheduleType: string;
    scheduleId: string;
}


export interface DocumentPersister {
    publishDocument(lambdaName: string, payload: string): Promise<boolean>;
    updateDocument(parameters: any): Promise<Object>;
    getDocument(documentARN: string): Promise<Object>;
    getDocumentByArn(documentARN: string): Promise<DocumentPayloadResponse>;
    getDocumentByArnV1(documentARN: string): Promise<DocumentPayloadResponseV1>;
    scheduleWebhook(parameters: ScheduleEditorialRecordParamateres): Promise<object>;
    publishDocumentV1(lambdaName: string, payload: string): Promise<boolean>;
    sendEmail(parameters: any, baseURL: string): Promise<Object>;
    getDocumentById(documentId: string, baseURL: string): Promise<Object>;
}
import { DocumentParameters, ScheduleEditorialRecordParamateres } from "../EditorialRecordRepository";

export interface DocumentPayloadResponse {
    success: boolean;
    payload: string | Error;
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
    scheduleWebhook(parameters: ScheduleEditorialRecordParamateres): Promise<object>;
}
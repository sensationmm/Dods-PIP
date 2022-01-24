import {
    ScheduleEditorialRecordParamateres
} from '.';
export interface DocumentPublishPersister {
    publishDocument(lambdaName: string, payload: string): Promise<boolean>;
    scheduleWebhook(parameters: ScheduleEditorialRecordParamateres): Promise<object>
}

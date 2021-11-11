import { EditorRecordStatusOutput } from './EditorialRecord';

export interface EditorialRecordStatusPersister {
    getEditorialRecordStatuses(): Promise<Array<EditorRecordStatusOutput>>;
}

export interface EditorRecordStatusOutput {
    uuid: string;
    name: string;
}

export interface EditorialRecordStatusPersister {
    getEditorialRecordStatuses(): Promise<Array<EditorRecordStatusOutput>>;
}

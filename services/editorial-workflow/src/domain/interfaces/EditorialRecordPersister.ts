import {
    CreateEditorialRecordParameters,
    EditorialRecordListOutput,
    EditorialRecordOutput,
    SearchEditorialRecordParameters,
    UpdateEditorialRecordParameters,
} from '.';

export interface EditorialRecordPersister {
    createEditorialRecord(data: CreateEditorialRecordParameters): Promise<EditorialRecordOutput>;

    listEditorialRecords(
        searchParameters: SearchEditorialRecordParameters
    ): Promise<EditorialRecordListOutput>;

    updateEditorialRecord(data: UpdateEditorialRecordParameters): Promise<EditorialRecordOutput>;
}

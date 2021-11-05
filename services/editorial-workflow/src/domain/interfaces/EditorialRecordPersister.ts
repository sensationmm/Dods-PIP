import { CreateEditorialRecordParameters, EditorialRecordOutput } from '.';

export interface EditorialRecordPersister {
    createEditorialRecord(data: CreateEditorialRecordParameters): Promise<EditorialRecordOutput>;
}

import { CreateEditorialRecordParameters, EditorialRecord } from "../domain";

export interface EditorialRepository {
    createEditorialRecord(data: CreateEditorialRecordParameters): Promise<EditorialRecord>;
}
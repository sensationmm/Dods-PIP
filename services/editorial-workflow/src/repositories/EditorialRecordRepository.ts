import {
    CreateEditorialRecordParameters,
    EditorialRecordOutput,
    EditorialRecordPersister,
} from '../domain';

import { EditorialRecord } from '@dodsgroup/dods-model';

export class EditorialRecordRepository implements EditorialRecordPersister {
    constructor(private editorialRecordModel: typeof EditorialRecord) {}

    static defaultInstance = new EditorialRecordRepository(EditorialRecord);

    static mapModelToOutput = (model: EditorialRecord) => {
        const { uuid, documentName, s3Location } = model;

        return { uuid, documentName, s3Location };
    };

    async createEditorialRecord(
        params: CreateEditorialRecordParameters
    ): Promise<EditorialRecordOutput> {
        const newRecord = await this.editorialRecordModel.create(params, {});

        return EditorialRecordRepository.mapModelToOutput(newRecord);
    }
}

import { EditorialRecordStatus } from '@dodsgroup/dods-model';
import { EditorRecordStatusOutput, EditorialRecordStatusPersister } from './domain';

export * from './domain';

export class EditorialRecordStatusesRepository implements EditorialRecordStatusPersister {
    static defaultInstance: EditorialRecordStatusPersister = new EditorialRecordStatusesRepository(EditorialRecordStatus);

    constructor(private editorialRecordStatusModel: typeof EditorialRecordStatus) { }

    static parseEditorialRecordStatusesResponseFromModel(modelList: EditorialRecordStatus[]): EditorRecordStatusOutput[] {
        const response: EditorRecordStatusOutput[] = modelList?.map(model => {
            return {
                uuid: model.uuid,
                name: model.status,
            };
        });

        return response;
    }

    async getEditorialRecordStatuses(): Promise<Array<EditorRecordStatusOutput>> {
        const records = await this.editorialRecordStatusModel.findAll();

        return EditorialRecordStatusesRepository.parseEditorialRecordStatusesResponseFromModel(records);
    }
}

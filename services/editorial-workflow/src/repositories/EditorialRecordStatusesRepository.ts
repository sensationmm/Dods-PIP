import {
    EditorRecordStatusOutput
} from '../domain';

import {EditorialRecordStatusPersister} from '../domain/interfaces/EditorialRecordStatusPersister';

import { EditorialRecordStatus } from '@dodsgroup/dods-model';

export class EditorialRecordStatusesRepository implements EditorialRecordStatusPersister {
    constructor(private editorialRecordStatusModel: typeof EditorialRecordStatus) {}

    static defaultInstance = new EditorialRecordStatusesRepository(EditorialRecordStatus);

    static parseEditorialRecordStatusesResponseFromModel(modelList: EditorialRecordStatus[]): EditorRecordStatusOutput[] {
        const response: EditorRecordStatusOutput[] = modelList?.map(model => {
            return {
                uuid: model.uuid,
                name: model.status,
            };
        });
    
        return response;
    }

    async getEditorialRecordStatuses(
    ): Promise<Array<EditorRecordStatusOutput>> {
        const records = await this.editorialRecordStatusModel.findAll();
        
        return EditorialRecordStatusesRepository.parseEditorialRecordStatusesResponseFromModel(records);
    }
}



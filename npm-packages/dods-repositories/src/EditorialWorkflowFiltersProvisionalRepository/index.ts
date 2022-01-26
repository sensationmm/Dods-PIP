import { EditorialRecord, QueryTypes } from '@dodsgroup/dods-model';
import { ContentSourceOutput, DistinctItem, EditorialWorkflowFiltersProvisionalPersister, InformationTypeOutput } from './domain';

export * from './domain';

export class EditorialWorkflowFiltersProvisionalRepository implements EditorialWorkflowFiltersProvisionalPersister {
    static defaultInstance: EditorialWorkflowFiltersProvisionalPersister = new EditorialWorkflowFiltersProvisionalRepository(EditorialRecord);
    
    constructor(private editorialRecordModel: typeof EditorialRecord) { }

    static parseContentSourcesFromModel(modelList: any): ContentSourceOutput[] {

        const response: ContentSourceOutput[] = modelList.map((model: DistinctItem) => {
            return {
                id: model.item,
                name: model.item
            };
        });

        return response;
    }

    static parseInformationTypesFromModel(modelList: any): InformationTypeOutput[] {

        const response: InformationTypeOutput[] = modelList!.map((model: DistinctItem) => {
            return {
                id: model.item,
                name: model.item
            };
        });

        return response;
    }

    async getContentSourcesList(): Promise<ContentSourceOutput[]> {

        const contentSources = await this.editorialRecordModel?.sequelize?.query('SELECT DISTINCT(`content_source`) AS `item` FROM `dods_editorial_records` AS `EditorialRecord` where `content_source` is not null order by `item`', {
            plain: false,
            type: QueryTypes.SELECT,
        });

        return EditorialWorkflowFiltersProvisionalRepository.parseContentSourcesFromModel(contentSources);
    }

    async getInformationTypesList(): Promise<InformationTypeOutput[]> {

        const informationTypes = await this.editorialRecordModel?.sequelize?.query('SELECT DISTINCT(`information_type`) AS `item` FROM `dods_editorial_records` AS `EditorialRecord` where `information_type` is not null order by `item`', {
            plain: false,
            type: QueryTypes.SELECT,
        });

        return EditorialWorkflowFiltersProvisionalRepository.parseContentSourcesFromModel(informationTypes);
    }
}

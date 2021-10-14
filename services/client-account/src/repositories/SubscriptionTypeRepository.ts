import { SubscriptionTypeModel } from '../db/models';
import { SubscriptionTypePersister } from '../domain/interfaces/SubscriptionTypePersister';
import { SubscriptionTypeResponse, } from '../domain';

function parseSubscriptionTypesResponseFromModel(modelList: SubscriptionTypeModel[]): SubscriptionTypeResponse[] {
    const response: SubscriptionTypeResponse[] = modelList.map(model => {
        return {
            uuid: model.uuid,
            name: model.name,
            location: model.location,
            contentType: model.contentType,
        };
    });

    return response;
}

export class SubscriptionTypeRepository implements SubscriptionTypePersister {
    static defaultInstance: SubscriptionTypePersister = new SubscriptionTypeRepository(SubscriptionTypeModel);

    constructor(private subscriptionTypeModel: typeof SubscriptionTypeModel) { }

    async getSubscriptionTypes(): Promise<Array<SubscriptionTypeResponse>> {
        const subscriptionTypes = await this.subscriptionTypeModel.findAll()
        const subscriptionTypesParsed = parseSubscriptionTypesResponseFromModel(subscriptionTypes)
        return subscriptionTypesParsed
    }
}

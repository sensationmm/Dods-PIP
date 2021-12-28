import { Collection, CollectionInput } from '@dodsgroup/dods-model';
import { CollectionPersister, CollectionResponse } from '../domain';

export class CollectionRepository implements CollectionPersister {
    static defaultInstance: CollectionRepository = new CollectionRepository(Collection);

    constructor(private model: typeof Collection) {}

    async createCollection(parameters: CollectionInput): Promise<Collection> {
        const newCollection = await this.model.create(parameters);
        return newCollection;
    }
    mapCollection(model: Collection): CollectionResponse {
        const { uuid, name, isActive, clientAccount, createdBy, createdAt, updatedAt } = model;
        return {
            uuid,
            name,
            isActive,
            clientAccount: clientAccount
                ? {
                      uuid: clientAccount.uuid,
                      name: clientAccount.name,
                  }
                : undefined,
            createdBy: createdBy
                ? {
                      uuid: createdBy.uuid,
                      name: createdBy.fullName,
                  }
                : undefined,
            createdAt,
            updatedAt,
        };
    }
}

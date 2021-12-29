import { CollectionResponse, CreateCollectionParameters } from '.';

import { Collection } from '@dodsgroup/dods-model';

export interface CreateCollectionPersisterParameters extends CreateCollectionParameters {
    isActive: boolean;
}

export interface CollectionPersister {
    createCollection(parameters: CreateCollectionPersisterParameters): Promise<Collection>;
    mapCollection(model: Collection): CollectionResponse;
}

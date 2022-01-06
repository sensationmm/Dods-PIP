import { CollectionInput } from '@dodsgroup/dods-model';

export interface CreateCollectionParameters
    extends Omit<CollectionInput, 'isActive' | 'clientAccountId' | 'createdById'> {
    clientAccountId: string;
    createdById: string;
}

export interface UpdateCollectionParameters {
    collectionId: string;
    name: string;
}

export interface CollectionResponse {
    uuid: string;
    name: string;
    isActive: boolean;
    clientAccount?: {
        uuid: string;
        name: string;
    };
    createdBy?: {
        uuid: string;
        name: string;
    };
    createdAt: Date;
    updatedAt: Date;
}


import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { CollectionRepository } from '../../repositories';
import { CreateCollectionParameters } from '../../domain';

export const createCollection: AsyncLambdaHandler<CreateCollectionParameters> = async (params) => {
    const { name, clientAccountId, createdById } = params;
    const newCollection = await CollectionRepository.defaultInstance.createCollection({
        name,
        isActive: true,
        clientAccountId,
        createdById,
    });

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'New Collection created',
        collection: CollectionRepository.defaultInstance.mapCollection(newCollection),
    });
};

import { AsyncLambdaHandler, HttpStatusCode, HttpResponse } from '@dodsgroup/dods-lambda';
import { CollectionsRepository, GetCollectionInput } from '@dodsgroup/dods-repositories';

export const getCollection: AsyncLambdaHandler<GetCollectionInput> = async (parameters) => {

    const response = await CollectionsRepository.defaultInstance.get(parameters);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Collection found',
        ...response,
    });
};
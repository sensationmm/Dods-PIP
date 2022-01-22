import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionsRepository, SearchCollectionsInput } from '@dodsgroup/dods-repositories';

export const searchCollections: AsyncLambdaHandler<SearchCollectionsInput> = async (parameters) => {

    const response = await CollectionsRepository.defaultInstance.list(parameters);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Collection List',
        ...response,
    });
};

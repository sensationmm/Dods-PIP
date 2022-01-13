import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionsRepository, SearchCollectionsInput } from '@dodsgroup/dods-repositories';

export const searchCollections: AsyncLambdaHandler<SearchCollectionsInput> = async (parameters) => {
    const { searchTerm, startsWith } = parameters;

    if (searchTerm && startsWith) {
        return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: 'Error: searchTerm and startsWith should not be used together.',
        });
    }

    const response = await CollectionsRepository.defaultInstance.list(parameters);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Collection List',
        ...response,
    });
};

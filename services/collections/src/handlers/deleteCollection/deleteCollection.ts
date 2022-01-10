import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionsRepository, DeleteCollectionInput } from '@dodsgroup/dods-repositories';

export const deleteCollection: AsyncLambdaHandler<DeleteCollectionInput> = async (params) => {

    await CollectionsRepository.defaultInstance.delete(params);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Collection was deleted succesfully',
    });
};

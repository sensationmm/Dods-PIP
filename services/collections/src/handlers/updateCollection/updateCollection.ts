import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { CollectionsRepository, UpdateCollectionParameters } from '@dodsgroup/dods-repositories';

export const updateCollection: AsyncLambdaHandler<UpdateCollectionParameters> = async (params) => {

    const updatedRecord = await CollectionsRepository.defaultInstance.update(params);

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Collection updated successfully',
        data: updatedRecord,
    });
};

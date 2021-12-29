import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { CollectionRepository } from '../../repositories';
import { UpdateCollectionParameters } from '../../domain';

export const updateCollection: AsyncLambdaHandler<UpdateCollectionParameters> = async (
    params
) => {

    try {
        const updatedRecord = await CollectionRepository.defaultInstance.updateCollection(
            params
        );

        const updatedResponse = CollectionRepository.defaultInstance.mapCollection(updatedRecord)

        return new HttpResponse(HttpStatusCode.OK, {
            success: true,
            message: 'Collection updated successfully',
            data: updatedResponse,
        });
    } catch (error) {
        //throw error;

        return new HttpResponse(HttpStatusCode.BAD_REQUEST, {
            success: false,
            message: error,
        });

    }
};

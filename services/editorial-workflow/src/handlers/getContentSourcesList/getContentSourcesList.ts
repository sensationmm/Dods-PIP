/* istanbul ignore file */

import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { EditorialWorkflowFiltersProvisionalRepository } from '@dodsgroup/dods-repositories';

export const getContentSourcesList: AsyncLambdaHandler = async () => {
    const contentSources = await EditorialWorkflowFiltersProvisionalRepository.defaultInstance.getContentSourcesList();
    
    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        contentSources: contentSources,
    });
};

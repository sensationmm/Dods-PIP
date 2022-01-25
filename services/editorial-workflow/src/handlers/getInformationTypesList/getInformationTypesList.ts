/* istanbul ignore file */

import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';

import { EditorialWorkflowFiltersProvisionalRepository } from '@dodsgroup/dods-repositories';

export const getInformationTypesList: AsyncLambdaHandler = async () => {
    const informationTypes = await EditorialWorkflowFiltersProvisionalRepository.defaultInstance.getInformationTypesList();

    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        informationTypes: informationTypes,
    });
};

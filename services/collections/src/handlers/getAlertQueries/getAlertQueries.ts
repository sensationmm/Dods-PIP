import { AsyncLambdaHandler, HttpResponse, HttpStatusCode } from '@dodsgroup/dods-lambda';
import { CollectionAlertsRepository, SearchAlertQueriesParameters } from '@dodsgroup/dods-repositories';

//import { CollectionRepository } from '../../repositories';

//import { SearchAlertQueriesParameters } from '../../domain';


export const getAlertQueries: AsyncLambdaHandler<SearchAlertQueriesParameters> = async (
    parameters
) => {

    parameters.offset = parameters.offset || '0';
    parameters.limit = parameters.limit || '5';
    parameters.sortDirection = parameters.sortDirection || 'ASC'

    const response = await CollectionAlertsRepository.defaultInstance.getAlertQueries(parameters);
    return new HttpResponse(HttpStatusCode.OK, {
        success: true,
        message: 'Alert queries found',
        limit: parseInt(parameters.limit),
        offset: parseInt(parameters.offset),
        totalRecords: response.count,
        queries: response.queries

    });


};

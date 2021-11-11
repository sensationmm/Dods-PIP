import { buildLambdaFunction } from '@dodsgroup/dods-lambda';
import { config } from '../../domain';
import { getEditorialRecordStatusList } from './getEditorialRecordStatusList';

export const handle = buildLambdaFunction(getEditorialRecordStatusList, {
    openApiDocumentPath: config.openApiPath,
    validateRequests: false,
    validateResponses: true,
});

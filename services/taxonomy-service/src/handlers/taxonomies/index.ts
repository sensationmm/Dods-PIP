import { buildLambdaFunction } from "../../lambdaMiddleware";
import { getTaxonomies } from "./getTaxonomies";
import { config } from '../../domain/config';

export const handle = buildLambdaFunction(getTaxonomies, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });
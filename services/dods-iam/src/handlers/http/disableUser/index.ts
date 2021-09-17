import { buildLambdaFunction } from "../../../lambdaMiddleware";
import { config } from '../../../domain';
import { disableUser } from "./disableUser";

export const handle = buildLambdaFunction(disableUser, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });
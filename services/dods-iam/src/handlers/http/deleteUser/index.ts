import { buildLambdaFunction } from "../../../lambdaMiddleware";
import { config } from '../../../domain';
import { deleteUser } from "./deleteUser";

export const handle = buildLambdaFunction(deleteUser, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });
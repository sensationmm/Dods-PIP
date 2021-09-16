import { buildLambdaFunction } from "../../lambdaMiddleware";
import { sayHello } from "./sayHello";
import { config } from '../../domain/config';

export const handle = buildLambdaFunction(sayHello, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false });
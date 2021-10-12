import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { sayHello } from "./sayHello";
import { config } from '../../domain';

export const handle = buildLambdaFunction(sayHello, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false });
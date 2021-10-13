import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { sayEnglishHello } from "./sayEnglishHello";
import { config } from '../../domain';

export const handle = buildLambdaFunction(sayEnglishHello, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: false });
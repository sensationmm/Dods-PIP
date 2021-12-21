import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { sayTurkishHello } from "./sayTurkishHello";
import { config } from '../../domain';

export const handle = buildLambdaFunction(sayTurkishHello, { openApiDocumentPath: config.openApiPath, validateRequests: true, validateResponses: true, validateSecurity: true });
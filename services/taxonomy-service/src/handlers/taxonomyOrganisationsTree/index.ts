import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { taxonomyTree } from "./taxonomyTree";
import { config } from '../../domain';

export const handle = buildLambdaFunction(taxonomyTree, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });
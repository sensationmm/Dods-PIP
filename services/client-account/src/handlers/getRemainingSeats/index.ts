import { buildLambdaFunction } from "../../lambdaMiddleware";
import { getRemainingSeats } from "./getRemainingSeats";
import { config } from '../../domain';


export const handle = buildLambdaFunction(getRemainingSeats, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });
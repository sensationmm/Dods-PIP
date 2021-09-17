// import { buildLambdaFunction } from "../../../lambdaMiddleware";
// import { config } from '../../../domain';
import { onLoginPasswordEvents } from "./onLoginPasswordEvents";

// export const handle = buildLambdaFunction(onLoginPasswordEvents, { openApiDocumentPath: config.openApiPath, validateRequests: false, validateResponses: false });
export const handle = onLoginPasswordEvents;
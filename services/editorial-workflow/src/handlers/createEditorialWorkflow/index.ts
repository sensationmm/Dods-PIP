import { buildLambdaFunction } from "@dodsgroup/dods-lambda";
import { createEditorialWorkflow } from "./createEditorialWorkflow";

export const handle = buildLambdaFunction(createEditorialWorkflow, { validateRequests: false, validateResponses: false });
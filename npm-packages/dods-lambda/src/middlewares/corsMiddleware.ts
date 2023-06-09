import { APIGatewayProxyEvent } from "aws-lambda";
import { AsyncLambdaMiddleware } from "nut-pipe";
import { HttpResponse, HttpStatusCode } from "@dodsgroup/dods-domain";
import { Logger } from "../utility";

const { CORS_ORIGINS = '*' } = process.env;

const corsOrigins = CORS_ORIGINS.split(',');

const corsIsAllowed = (conf: CorsConfig, origin?: string): boolean =>
    origin == undefined || conf.allowOrigin.map((ao) => ao == '*' || ao.indexOf(origin) !== -1).reduce((prev, current) => prev || current);

export class CorsConfig {
    allowOrigin: Array<string>;
    allowCredentials: boolean;
    constructor(allow: Array<string>, allowCredentials: boolean) {
        this.allowOrigin = allow;
        this.allowCredentials = allowCredentials;
    }
}

export const DefaultCorsConfig = new CorsConfig(corsOrigins, true);

export const corsMiddleware: AsyncLambdaMiddleware<APIGatewayProxyEvent> = async (event, context, callback, next) => {

    Logger.info('CorsMiddleware Entry', { ...DefaultCorsConfig });

    if (!corsIsAllowed(DefaultCorsConfig, event.headers?.Origin)) {
        return new HttpResponse(HttpStatusCode.FORBIDDEN, {
            success: false,
            message: `Invalid CORS Origin: '${event.headers.Origin}'`,
            // error: rest,
        });
    }

    if(event.headers){
        event.headers['Access-Control-Allow-Origin'] = '*';
        event.headers['Access-Control-Allow-Credentials'] = 'true';
    }

    const result = await next!(event, context, callback);

    Logger.info('CorsMiddleware Success');

    return result;
};

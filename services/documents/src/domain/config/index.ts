import Joi, { Schema } from 'joi';
import { resolve } from 'path';
import { DownstreamEndpoints } from '../interfaces';

const loadConfig = (schema: Schema) => {

    const { value: envVars, error } = schema.prefs({ errors: { label: 'key' } }).validate(process.env);

    if (error) {
        console.error(`Config validation error: ${error.message}`);
        process.exit(1);
    }

    return envVars;
};

const stages = ['production', 'development', 'test'];

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid(...stages).default('test'),
        SERVERLESS_STAGE: Joi.string().required().default('test'),
        SERVERLESS_REGION: Joi.string().required(),
        SERVERLESS_PORT: Joi.number().required().default(3000),
        CORS_ORIGINS: Joi.string().required().default('*'),
        API_GATEWAY_BASE_URL: Joi.string().required(),
        CONTENT_BUCKET: Joi.string().required(),
    })
    .unknown();

const envVars = loadConfig(envVarsSchema);

export const config = {
    env: envVars.NODE_ENV as string,
    isTestEnv: envVars.NODE_ENV !== 'test',
    openApiPath: resolve(process.cwd(), 'src/openApi.yml'),
    test: {
        stage: envVars.SERVERLESS_STAGE as string,
        port: envVars.SERVERLESS_PORT as number,
        endpoint: `http://localhost:${envVars.SERVERLESS_PORT}/${envVars.SERVERLESS_STAGE}` as string
    },
    dods: {
        downstreamEndpoints: {
            apiGatewayBaseURL: envVars.API_GATEWAY_BASE_URL as string,
            // sayTurkishHelloEndpointUrl: envVars.SAY_TURKISH_HELLO_ENDPOINT as string,
            // sayEnglishHelloEndpointUrl: envVars.SAY_ENGLISH_HELLO_ENDPOINT as string,
            // getFullNameEndpointUrl: envVars.GET_FULL_NAME_ENDPOINT as string
        } as DownstreamEndpoints
    },
    aws: {
        region: envVars.SERVERLESS_REGION as string,
        buckets: {
            content: envVars.CONTENT_BUCKET as string,
        }
    }
};
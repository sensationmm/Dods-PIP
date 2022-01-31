import Joi, { Schema } from 'joi';
import { resolve } from 'path';

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
        SERVERLESS_PORT: Joi.number().required().default(3000),
        CORS_ORIGINS: Joi.string().required().default('*'),
        API_GATEWAY_BASE_URL: Joi.string().required(),
        ES_CLOUD_ID: Joi.string().required(),
        ES_KEY_ID: Joi.string().required(),
        ES_API_KEY: Joi.string().required(),
        ALERT_API_KEY: Joi.string().required(),
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
        },
        downstreamKeys: {
            alertApiKey: envVars.ALERT_API_KEY as string,
        }
    },
    aws: {},
    elasticsearch: {
        esCloudId: envVars.ES_CLOUD_ID as string,
        esKeyId: envVars.ES_KEY_ID as string,
        esApiKey: envVars.ES_API_KEY as string,
    }
};
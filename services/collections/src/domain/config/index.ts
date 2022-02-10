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
        DB_DRIVER: Joi.string().required().valid('mysql', 'postgres', 'sqlite', 'mariadb', 'mssql'),
        DB_HOST: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_CONNECTION_LIMIT: Joi.number().default(5),
        API_GATEWAY_BASE_URL: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
    })
    .unknown();

const envVars = loadConfig(envVarsSchema);

export const config = {
    env: envVars.NODE_ENV as string,
    isTestEnv: envVars.NODE_ENV !== 'test',
    openApiPath: resolve(process.cwd(), 'src/openApi.yml'),
    singleFullAlertPath: resolve(process.cwd(), 'src/handlers/processImmediateAlert/template.handlebars'),
    multipleSnippetAlertPath: resolve(process.cwd(), 'src/handlers/processAlert/template.handlebars'),
    test: {
        stage: envVars.SERVERLESS_STAGE as string,
        port: envVars.SERVERLESS_PORT as number,
        endpoint: `http://localhost:${envVars.SERVERLESS_PORT}/${envVars.SERVERLESS_STAGE}` as string
    },
    dods: {
        downstreamEndpoints: {
            apiGatewayBaseURL: envVars.API_GATEWAY_BASE_URL as string,
            frontEndURL: envVars.FRONTEND_URL as string,
        }
    },
    aws: {
        mariaDb: {
            dbDriver: envVars.DB_DRIVER as string,
            host: envVars.DB_HOST as string,
            database: envVars.DB_NAME as string,
            username: envVars.DB_USER as string,
            password: envVars.DB_PASSWORD as string,
            connectionLimit: envVars.DB_CONNECTION_LIMIT as number,
        },
    }
};
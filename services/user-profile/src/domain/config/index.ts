import Joi, { Schema } from 'joi';
import { resolve } from 'path';
import { DownstreamEndpoints } from '../interfaces';

const loadConfig = (schema: Schema) => {
    const { value: envVars, error } = schema
        .prefs({ errors: { label: 'key' } })
        .validate(process.env);

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
        GET_USER_ENDPOINT: Joi.string().required(),
        GET_USERBYNAME_ENDPOINT: Joi.string().required(),
        GET_ROLE_ENDPOINT: Joi.string().required(),
        DB_DRIVER: Joi.string().required().valid('mysql', 'postgres', 'sqlite', 'mariadb', 'mssql'),
        DB_HOST: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_CONNECTION_LIMIT: Joi.number().default(5),
    })
    .unknown();

const envVars = loadConfig(envVarsSchema);

export const config = {
    env: envVars.NODE_ENV as string,
    isTestEnv: envVars.NODE_ENV === 'test',
    openApiPath: resolve(process.cwd(), 'src/openApi.yml'),
    test: {
        stage: envVars.SERVERLESS_STAGE as string,
        port: envVars.SERVERLESS_PORT as number,
        endpoint: `http://localhost:${envVars.SERVERLESS_PORT}/${envVars.SERVERLESS_STAGE}` as string,
    },
    dods: {
        downstreamEndpoints: {
            getUserEndpoint: envVars.GET_USER_ENDPOINT as string,
            getUserByNameEndpoint: envVars.GET_USERBYNAME_ENDPOINT as string,
            getRoleEndpoint: envVars.GET_ROLE_ENDPOINT as string,
        } as DownstreamEndpoints,
    },
    aws: {
        mariaDb: {
            dbDriver: envVars.DB_DRIVER as string,
            host: envVars.DB_HOST as string,
            database: envVars.DB_NAME as string,
            username: envVars.DB_USER as string,
            password: envVars.DB_PASSWORD as string,
            connectionLimit: envVars.DB_CONNECTION_LIMIT as number
        },
    },
};

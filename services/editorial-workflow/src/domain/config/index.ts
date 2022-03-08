import Joi, { Schema } from 'joi';

import { resolve } from 'path';

const loadConfig = (schema: Schema) => {
    const { value: envVars, error } = schema
        .prefs({ errors: { label: 'key' } })
        .validate(process.env);

    if (error) {
        console.log(`Config validation error: ${error.message}`);
        process.exit(1);
    }

    return envVars;
};

const stages = ['production', 'development', 'test'];

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid(...stages).default('development'),
        SERVERLESS_REGION: Joi.string().required(),
        SERVERLESS_STAGE: Joi.string().required().default('dev'),
        SERVERLESS_PORT: Joi.number().required().default(3000),
        CORS_ORIGINS: Joi.string().required().default('*'),
        DB_DRIVER: Joi.string().required().valid('mysql', 'postgres', 'sqlite', 'mariadb', 'mssql'),
        DB_HOST: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_CONNECTION_LIMIT: Joi.number().default(5),
        BASE_URL: Joi.string().required(),
        BUCKET_EDITORIAL: Joi.string().required(),
        CONTENT_INDEXER_LAMBDA: Joi.string().required(),
        API_KEY_BACKEND: Joi.string().required(),
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
            userProfile: envVars.BASE_URL as string,
        },
        recordStatuses: {
            draft: '89cf96f7-d380-4c30-abcf-74c57843f50c',
            ingested: 'b54bea83-fa06-4bd4-852d-08e5908c55b5',
            created: 'a1c5e035-28d3-4ac3-b5b9-240e0b11dbce',
            inProgress: 'bbffb0d0-cb43-464d-a4ea-aa9ebd14a138',
            scheduled: 'c6dadaed-de7f-45c1-bcdf-f3bbef389a60',
        },
    },
    aws: {
        region: envVars.SERVERLESS_REGION as string,
        mariaDb: {
            dbDriver: envVars.DB_DRIVER as string,
            host: envVars.DB_HOST as string,
            database: envVars.DB_NAME as string,
            username: envVars.DB_USER as string,
            password: envVars.DB_PASSWORD as string,
            connectionLimit: envVars.DB_CONNECTION_LIMIT as number,
        },
        lambdas: {
            contentIndexer: envVars.CONTENT_INDEXER_LAMBDA as string,
        },
        buckets: {
            documents: envVars.BUCKET_EDITORIAL as string,
        },
        keys: {
            api_key: envVars.API_KEY_BACKEND as string,
        }
    },
};

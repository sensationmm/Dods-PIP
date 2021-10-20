import Joi, { Schema } from 'joi';

import { execSync } from 'child_process';
import { resolve } from 'path';

const fullServerlessInfoCommand = `SLS_DEPRECATION_DISABLE='*' npx serverless print --stage ${process.env.SERVERLESS_STAGE || 'test'
    } --format json${process.env.SERVERLESS_STAGE === 'local' ? ' | tail -n +2' : ''
    }`;

let infoCache = '';
const fetchServerlessInfo = (): string => {
    if (infoCache !== '') {
        return infoCache;
    } else {
        console.debug(`Running \`${fullServerlessInfoCommand}\`...`, null);
        const info = execSync(fullServerlessInfoCommand).toString();
        infoCache = info;
        return infoCache;
    }
};

const setUnitTestEnvironmentVariables = () => {
    if (process.env.NODE_ENV === 'test') {
        let serverlessInfoJson;

        try {
            serverlessInfoJson = fetchServerlessInfo();
        } catch (error: any) {
            console.error(error.stdout.toString('utf8'));

            process.exit(1);
        }

        let serverlessInfo;
        try {
            serverlessInfo = JSON.parse(serverlessInfoJson);
        } catch (error: any) {
            console.error(
                `ERROR: when JSON.parse() try to parse the following output. \n\n ${serverlessInfoJson}`
            );

            process.exit(1);
        }

        Object.assign(process.env, serverlessInfo.provider.environment);
    }
};

const loadConfig = (schema: Schema) => {
    setUnitTestEnvironmentVariables();

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
        SERVERLESS_STAGE: Joi.string().required().valid('prod', 'dev', 'test').default('test'),
        SERVERLESS_PORT: Joi.number().required().default(3000),
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
        endpoint:
            `http://localhost:${envVars.SERVERLESS_PORT}/${envVars.SERVERLESS_STAGE}` as string,
    },
    dods: {
        downstreamEndpoints: {},
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
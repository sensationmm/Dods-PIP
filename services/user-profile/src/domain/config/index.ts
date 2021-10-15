import Joi, { Schema } from 'joi';

import { DownstreamEndpoints } from '../interfaces';
import { execSync } from 'child_process';
import { resolve } from 'path';

const fullServerlessInfoCommand = `SLS_DEPRECATION_DISABLE='*' npx serverless print --stage ${
    process.env.SERVERLESS_STAGE || 'dev'
} --format json${process.env.SERVERLESS_STAGE === 'local' ? ' | tail -n +2' : ''}`;

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
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
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
        console.log(`Config validation error: ${error.message}`);
        process.exit(1);
    }

    return envVars;
};

const stages = ['prod', 'dev', 'test'];

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string()
            .valid(...stages)
            .default('dev'),
        SERVERLESS_STAGE: Joi.string().required().valid('prod', 'dev', 'test').default('dev'),
        SERVERLESS_PORT: Joi.number().required().default(3000),
        GET_USER_ENDPOINT: Joi.string().required(),
        GET_USERBYNAME_ENDPOINT: Joi.string().required(),
        GET_ROLE_ENDPOINT: Joi.string().required(),
        MARIADB_CONNECTION_STRING: Joi.string().required(),
        MARIADB_CONNECTION_LIMIT: Joi.string().required(),
    })
    .unknown();

const envVars = loadConfig(envVarsSchema);

export const config = {
    env: envVars.NODE_ENV as string,
    isTestEnv: envVars.NODE_ENV !== 'dev',
    openApiPath: resolve(process.cwd(), 'src/openApi.yml'),
    local: {
        stage: envVars.SERVERLESS_STAGE as string,
        port: envVars.SERVERLESS_PORT as number,
        endpoint:
            `http://localhost:${envVars.SERVERLESS_PORT}/${envVars.SERVERLESS_STAGE}` as string,
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
            connectionString: envVars.MARIADB_CONNECTION_STRING as string,
            connectionLimit: envVars.MARIADB_CONNECTION_LIMIT as number,
        },
    },
};

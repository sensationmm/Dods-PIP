import Joi, { Schema } from 'joi';
import { resolve } from 'path';
import { execSync } from 'child_process'

const fullServerlessInfoCommand = `SLS_DEPRECATION_DISABLE='*' npx serverless print --stage ${process.env.SERVERLESS_STAGE || 'test'} --format json${process.env.SERVERLESS_STAGE === 'local' ? ' | tail -n +2' : ''}`;

let infoCache = ''
const fetchServerlessInfo = (): string => {
    if (infoCache !== '') {
        return infoCache;
    } else {
        console.debug(`Running \`${fullServerlessInfoCommand}\`...`, null)
        return execSync(fullServerlessInfoCommand).toString()
    }
}

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
            console.error(`ERROR: when JSON.parse() try to parse the following output. \n\n ${serverlessInfoJson}`);

            process.exit(1);
        }

        Object.assign(process.env, serverlessInfo.provider.environment);
    }
};

const loadConfig = (schema: Schema) => {

    setUnitTestEnvironmentVariables();

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
        SERVERLESS_STAGE: Joi.string().required().valid('production', 'dev', 'test').default('test'),
        SERVERLESS_PORT: Joi.number().required().default(3000),
        ES_CLOUD_ID: Joi.string().required(),
        ES_KEY_ID: Joi.string().required(),
        ES_API_KEY: Joi.string().required(),
        TAXONOMY_TREE_BUCKET: Joi.string().required(),
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
        downstreamEndpoints: {}
    },
    aws: {
        TAXONOMY_TREE_BUCKET: envVars.TAXONOMY_TREE_BUCKET as string,
    },
    elasticsearch: {
        esCloudId: envVars.ES_CLOUD_ID as string,
        esKeyId: envVars.ES_KEY_ID as string,
        esApiKey: envVars.ES_API_KEY as string,
    }
};
import Joi, { Schema } from 'joi';
import { resolve } from 'path';
import { DownstreamEndpoints } from '../interfaces';
import { execSync } from 'child_process'

const fullServerlessInfoCommand = `SLS_DEPRECATION_DISABLE='*' npx serverless print --stage ${process.env.SERVERLESS_STAGE || 'test'} --format json${process.env.SERVERLESS_STAGE === 'prod' ? '' : ' | tail -n +2'}`;
// const fullServerlessInfoCommand = `SLS_DEPRECATION_DISABLE='*' npx serverless print --stage ${process.env.SERVERLESS_STAGE || 'test'} --format json`;

let infoCache = ''
const fetchServerlessInfo = (): string => {
    if (infoCache !== '') {
        return infoCache;
    } else {
        console.debug(`Running \`${fullServerlessInfoCommand}\`...`, null)
        const info = execSync(fullServerlessInfoCommand).toString()
        infoCache = info
        return infoCache;
    }
}

const loadConfig = (schema: Schema) => {

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
        SERVERLESS_STAGE: Joi.string().required().valid('prod', 'dev', 'test').default('test'),
        SERVERLESS_PORT: Joi.number().required().default(3000),
        SAY_TURKISH_HELLO_ENDPOINT: Joi.string().required(),
        SAY_ENGLISH_HELLO_ENDPOINT: Joi.string().required()
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
            sayTurkishHelloEndpointUrl: envVars.SAY_TURKISH_HELLO_ENDPOINT as string,
            sayEnglishHelloEndpointUrl: envVars.SAY_ENGLISH_HELLO_ENDPOINT as string
        } as DownstreamEndpoints
    },
    aws: {}
};
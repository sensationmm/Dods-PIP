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
        const info = execSync(fullServerlessInfoCommand).toString()
        infoCache = info
        return infoCache;
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

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().required().valid('production', 'development', 'test').default('development'),
        SERVERLESS_STAGE: Joi.string().required().default('dev'),
        COGNITO_USER_POOL_ID: Joi.string().required().description('AWS Cognito User Pool ID'),
        COGNITO_CLIENT_ID: Joi.string().required().description('AWS Cognito Client ID'),
        FAILED_LOGIN_ATTEMPT_COUNT: Joi.number().required().default(3).description('AWS Cognito Failed Login Attempt Count'),
        RESET_PASSWORD_URL: Joi.string().required().description('Dods Reset User Password page url'),
        LOGIN_EVENT_BUS_NAME: Joi.string().required().description('Dods Login Event Bus Name'),
        LOGIN_EVENT_BUS_ARN: Joi.string().required().description('Dods Login Event Bus ARN'),
        LOGIN_DYNAMODB_TABLE: Joi.string().required().description('Dods Login Dynamodb Table Name')
    })
    .unknown();

const envVars = loadConfig(envVarsSchema);

export const config = {
    env: envVars.NODE_ENV as string,
    serverlessStage: envVars.SERVERLESS_STAGE as string,
    openApiPath: resolve(process.cwd(), 'src/openApi.yml') as string,
    dods: {
        resetPasswordUrl: envVars.RESET_PASSWORD_URL as string
    },
    aws: {
        resources: {
            cognito: {
                userPoolId: envVars.COGNITO_USER_POOL_ID as string,
                clientId: envVars.COGNITO_CLIENT_ID as string,
                failedLoginAttemptCount: envVars.FAILED_LOGIN_ATTEMPT_COUNT as number
            },
            loginDynamodbTableName: envVars.LOGIN_DYNAMODB_TABLE as string,
            loginEventBusName: envVars.LOGIN_EVENT_BUS_NAME as string,
            loginEventBusArn: envVars.LOGIN_EVENT_BUS_ARN as string
        }
    }
};
const { execSync } = require('child_process');

const fullServerlessInfoCommand = `npx serverless print --stage dev --format json | sed '/Serverless:/d'`;

let infoCache = '';
const fetchServerlessInfo = () => {
    if (infoCache !== '') {
        return infoCache;
    } else {
        console.debug(`Running \`${fullServerlessInfoCommand}\`...`, null);
        const info = execSync(fullServerlessInfoCommand).toString();
        infoCache = info;
        return infoCache;
    }
};

const setEnvironmentVariablesForTest = () => {
    if (process.env.NODE_ENV === 'test') {
        let serverlessInfoJson;

        try {
            serverlessInfoJson = fetchServerlessInfo();
        } catch (error) {
            console.error(error.stdout.toString('utf8'));

            process.exit(1);
        }

        let serverlessInfo;
        try {
            serverlessInfo = JSON.parse(serverlessInfoJson);
        } catch (error) {
            console.error(
                `ERROR: when JSON.parse() try to parse the following output. \n\n ${serverlessInfoJson}`
            );

            process.exit(1);
        }

        Object.assign(process.env, serverlessInfo.provider.environment);
    }
};

module.exports = { setEnvironmentVariablesForTest };
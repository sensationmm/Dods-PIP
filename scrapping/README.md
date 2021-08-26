This folder hosts the infrastructure and Lambda definitions for the different context extraction processes (scrapers) used by Dods.

```
.
├── README.md
├── package.json
├── scraper-bootstrap.sh
├── scrapping_deploy.sh
├── debates-hoc-uk/
├── debates-hol-uk/
├── debates-nir/
├── debates-wls/
├── infra/
├── lib/
├── motions-edm-uk/
├── oralQuestions-hoc-uk/
├── oralQuestions-hol-uk/
├── serverless.common.yml/
├── templates/
├── writtenQuestions-hoc-uk/
└── writtenQuestions-hol-uk/
```
Where:
- `infra` hold AWS CDK definitions of AWS resources common to all Lambda functions
- `lib` holds Python code common to all scrapers
- `templates` holds JSON templates needed for content formating 
- `

## Usage

### Deployment

This example is made to work with the Serverless Framework 

```
$ serverless deploy
```

```bash
```

_Note_: In current form, after deployment, the API is public and can be invoked by anyone. For the production deployment, we want to configure an authorizer. For details on how to do that, refer to [http event docs](https://www.serverless.com/framework/docs/providers/aws/events/apigateway/).

### Invocation

After successful deployment, you can call the created application via HTTP:

```bash
curl 
```

Which should result in response similar to the following

```json
{
}
```

### Local development

You can invoke your function locally by using the following command:

```bash
serverless invoke local --function 
```

Which should result in response similar to the following:

```
```

Alternatively, it is also possible to emulate API Gateway and Lambda locally by using `serverless-offline` plugin. In order to do that, execute the following command:

```bash
serverless plugin install -n serverless-offline
```

It will add the `serverless-offline` plugin to `devDependencies` in `package.json` file as well as will add it to `plugins` in `serverless.yml`.

After installation, you can start local emulation with:

```
serverless offline
```

To learn more about the capabilities of `serverless-offline`, please refer to its [GitHub repository](https://github.com/dherault/serverless-offline).
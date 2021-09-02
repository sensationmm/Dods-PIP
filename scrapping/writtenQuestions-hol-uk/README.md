# Written Questions / House of Lords / UK

This function performs scrapping for http://api.data.parliament.uk/resources/files/feed?dataset=1&filetype=qnaxml&take=500

## Schedule event type

This function is scheduled to run once a day using a cron expression defined on the serverless.yml file

When defining `schedule` events, we need to use `rate` or `cron` expression syntax.

### Rate expressions syntax

```pseudo
rate(value unit)
```

`value` - A positive number

`unit` - The unit of time. ( minute | minutes | hour | hours | day | days )

In below example, we use `rate` syntax to define `schedule` event that will trigger our `rateHandler` function every minute

```yml
functions:
  rateHandler:
    handler: handler.run
    events:
      - schedule: rate(1 minute)
```

Detailed information about rate expressions is available in official [AWS docs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#RateExpressions).


### Cron expressions syntax

```pseudo
cron(Minutes Hours Day-of-month Month Day-of-week Year)
```

All fields are required and time zone is UTC only.

| Field         | Values         | Wildcards     |
| ------------- |:--------------:|:-------------:|
| Minutes       | 0-59           | , - * /       |
| Hours         | 0-23           | , - * /       |
| Day-of-month  | 1-31           | , - * ? / L W |
| Month         | 1-12 or JAN-DEC| , - * /       |
| Day-of-week   | 1-7 or SUN-SAT | , - * ? / L # |
| Year          | 192199      | , - * /       |

In below example, we use `cron` syntax to define `schedule` event that will trigger our `cronHandler` function every second minute every Monday through Friday

```yml
functions:
  cronHandler:
    handler: handler.run
    events:
      - schedule: cron(0/2 * ? * MON-FRI *)
```

Detailed information about cron expressions in available in official [AWS docs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions).


## Usage
Blah blah

### Deployment

This example is made to work with the Serverless Framework.

In order to deploy run:

```
serverless deploy
```

After running deploy, you should see output similar to:

```bash
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service scraper-writtenquestions-hol-uk.zip file to S3 (84.82 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
........................
Serverless: Stack update finished...
Service Information
service: scraper-writtenquestions-hol-uk
stage: dev
region: us-east-1
stack: scraper-writtenquestions-hol-uk-dev
resources: 16
api keys:
  None
endpoints:
  None
functions:
  rateHandler: scraper-writtenquestions-hol-uk-dev-rateHandler
  cronHandler: scraper-writtenquestions-hol-uk-dev-cronHandler
layers:
  None
```

There is no additional step required. Your defined schedules becomes active right away after deployment.

### Local invocation

In order to test out your functions locally, you can invoke them with the following command:

```
serverless invoke local --function handler
```

After invocation, you should see output similar to:

```bash
2021-08-25 21:06:23,591 31462-4605246976 root [handler.py:24] :   DEBUG: BUCKET: infrastackdev-dodscontentextractiondevf4214acc-fvgqm0rmzab9

2021-08-25 21:06:23,776 31462-4605246976 urllib3.connectionpool [connectionpool.py:227] :   DEBUG: Starting new HTTP connection (1): api.data.parliament.uk:80

2021-08-25 21:06:24,080 31462-4605246976 urllib3.connectionpool [connectionpool.py:452] :   DEBUG: http://api.data.parliament.uk:80 "GET /resources/files/feed?dataset=1&filetype=qnaxml&take=500 HTTP/1.1" 301 0

2021-08-25 21:06:24,087 31462-4605246976 urllib3.connectionpool [connectionpool.py:971] :   DEBUG: Starting new HTTPS connection (1): api.data.parliament.uk:443

2021-08-25 21:06:24,885 31462-4605246976 urllib3.connectionpool [connectionpool.py:452] :   DEBUG: https://api.data.parliament.uk:443 "GET /resources/files/feed?dataset=1&filetype=qnaxml&take=500 HTTP/1.1" 200 10665

2021-08-25 21:06:25,085 31462-4605246976 urllib3.connectionpool [connectionpool.py:227] :   DEBUG: Starting new HTTP connection (1): api.data.parliament.uk:80
```

### Bundling dependencies

In case you would like to include 3rd party dependencies, you will need to use a plugin called `serverless-python-requirements`. You can set it up by running the following command:

```bash
serverless plugin install -n serverless-python-requirements
```

Running the above will automatically add `serverless-python-requirements` to `plugins` section in your `serverless.yml` file and add it as a `devDependency` to `package.json` file. The `package.json` file will be automatically created if it doesn't exist beforehand. Now you will be able to add your dependencies to `requirements.txt` file (`Pipfile` and `pyproject.toml` is also supported but requires additional configuration) and they will be automatically injected to Lambda package during build process. For more details about the plugin's configuration, please refer to [official documentation](https://github.com/UnitedIncome/serverless-python-requirements).

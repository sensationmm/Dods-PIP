service: scraper-$TPL_SLS_NAME

frameworkVersion: '2'
projectDir: ../
variablesResolutionMode: 20210326
configValidationMode: error


provider:
  name: aws
  runtime: python3.8
  lambdaHashingVersion: 20201221
  region: eu-west-1
  stage: ${opt:stage, 'dev'}

  environment:
    SERVERLESS_STAGE: ${self:provider.stage}

  iamRoleStatements:
    - ${file(../serverless.common.yml):lambdaPolicyS3}

functions:
  scrape:
    name: scraper-$TPL_SLS_NAME-${sls:stage}
    handler: handler.run
    events:
      # Invoke Lambda function every 55 minutes
      - schedule: rate(55 minutes)
  # cronHandler:
  #   handler: handler.run
  #   events:
  #     # Invoke Lambda function on Mon-Fri at 10:15 am
  #     - schedule: cron(15 10 ? * MON-FRI *)

plugins:
  - serverless-python-requirements

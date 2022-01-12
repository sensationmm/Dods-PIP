# README

This folder defines Lambda handlers for the backend _email-service_

## Important notes

This services uses SendGrid third-party service to send emails.
In order to use SendGrid the lambda functions need access to an API Key.

This API key is expected to be defined on the AWS Account that will host
this lambda on the SSM Parameter Store with the following key:

- /infra/sendgrid/key

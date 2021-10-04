# websites2020 deployment

This directory manages deployment for the Dods Political intelligence platform and infrastructure.
Centrally managed and self-documented deployment of new resources and apply CI/CD to the process.
This allows for version controlled, immutable infrastructure.

## Requirements
- set up an account area for you project in AWS console
- set up keypair
  - terraform-key
- set up roles
- set up S3 bucket with name matching in terraform.tf e.g: bucket = "dods-pip-terraform-state"
- provide this S3 bucket with a policy similar to this:

```
{
  "Version": "2012-10-17",
  "Id": "Policy1569934262834",
  "Statement": [
    {
      "Sid": "Stmt1569934259833",
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "arn:aws:iam::id:user/Terraform",
          "arn:aws:iam::id:root",
          "arn:aws:iam::id:role/OrganizationAccountAccessRole"
        ]
      },
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::dods-pip-remote-state-bucket",
        "arn:aws:s3:::dods-pip-terraform-remote-state-bucket/*"
      ]
    }
  ]
}
```

- Replace the principal account IDs with your own. Replace the "Terraform" user with the user of your terraform environment

## Run

> initial set up will require using the -lock=false parameter until the database responsible for storing lock info is created.
> `terraform init `
> `terraform plan `
> `terraform apply`

## Destroy
> To remove infrastructure managed by Terraform use `tearraform destroy`
- on destruction the remaining components may not be removed:
  - S3 buckets with content
  - dynamoDB Databases
  - IAM roles

## Tags

Resources should have the following tag convention, camelcase tags, lower case values:

|Name|Default|Options|
|---|---|---|
|`environment`|-|`development`, `production`, `staging`, `test`|
|`project`|-|`pip`, `project-2`|
|`version`|`1`|`1`, `2`, `3` etc|
|`owner`|-|`michael brown`, `giovanni espinosa`|
|`managedBy`|-|`terraform`, `serverless`, `console`|

# websites2020 deployment

This repo manages deployment for the 2020 new websites environments and infrastructure.
Centrally managed and self-documented deployment of new resources and apply CI/CD to the process.
This allows for version controlled, immutable infrastructure.

## Requirements
- set up an account area for you project in AWS console
- set up keypair
  - terraform-key
- set up roles
- set up S3 bucket with name matching in terraform.tf e.g: bucket = "mettr-websites2020-terraform-state"
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
        "arn:aws:s3:::da-terraform-remote-state-bucket",
        "arn:aws:s3:::da-terraform-remote-state-bucket/*"
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

Resources should have the following tag convention

|Name|Default|Options|
|---|---|---|
|`Environment`|-|`development`, `production`, `staging`, `test`|
|`ApplicationID`|-|`website-editor`, `website-builder`|
|`Version`|`1`|1, 2, 3 etc|
|`Owner`|-|-|
|`ManagedBy`|-|`terraform`, `serverless`, `console`|

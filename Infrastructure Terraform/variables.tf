variable "availability_zone_names" {
  type    = list(string)
  default = ["eu-west-1a", "eu-west-1b"]
}

variable "aws_region" {
  description = "The AWS region (e.g. 'eu-west-2')"
  default     = "eu-west-1"
  type        = string
}

variable "az_count" {
  description = "Number of AZs to cover in a given region"
  default     = "2"
  type        = string
}

locals {
  tf_role                     = "terraform-role"
  development_account_id      = "370648122295"
  staging_account_id          = "191100517659"
  production_account_id       = "035329505495"
  master_account_id           = "840176990118"
  external_id                 = "EXTERNAL_ID"
  development_tf_role         = "arn:aws:iam::${local.development_account_id}:role/${local.tf_role}"
  staging_tf_role             = "arn:aws:iam::${local.staging_account_id}:role/${local.tf_role}"
  production_tf_role          = "arn:aws:iam::${local.production_account_id}:role/${local.tf_role}"
  development_editor_endpoint = "https://builder.mettrr.dev/api/builder/build-2020"
  production_editor_endpoint  = "https://builder.mettrr.com/api/builder/build-2020"
  staging_editor_endpoint     = "https://builder.mettrr-staging.com/api/builder/build-2020"
  builder_dev_task_role_arn   = "arn:aws:iam::${local.development_account_id}:role/website-development-fargate-task-role"
  builder_staging_task_role_arn  = "arn:aws:iam::${local.staging_account_id}:role/website-staging-fargate-task-role"
  builder_prod_task_role_arn  = "arn:aws:iam::${local.production_account_id}:role/website-production-fargate-task-role"
}

variable "development_editor_table_name" {
  description = "dynamodb table name created by AWS Amplify CLI in the website-editor"
}

variable "staging_editor_table_name" {
  description = "dynamodb table name created by AWS Amplify CLI in the website-editor"
}

variable "production_editor_table_name" {
  description = "dynamodb table name created by AWS Amplify CLI in the website-editor"
}

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
  development_account_id      = "390773179818"
  staging_account_id          = "390773179818"
  production_account_id       = ""
  external_id                 = "EXTERNAL_ID"
  development_tf_role         = "arn:aws:iam::${local.development_account_id}:role/${local.tf_role}"
  staging_tf_role             = "arn:aws:iam::${local.staging_account_id}:role/${local.tf_role}"
  production_tf_role          = "arn:aws:iam::${local.production_account_id}:role/${local.tf_role}"
  builder_dev_task_role_arn   = "arn:aws:iam::${local.development_account_id}:role/website-development-fargate-task-role"
  builder_staging_task_role_arn  = "arn:aws:iam::${local.staging_account_id}:role/website-staging-fargate-task-role"
  builder_prod_task_role_arn  = "arn:aws:iam::${local.production_account_id}:role/website-production-fargate-task-role"
}

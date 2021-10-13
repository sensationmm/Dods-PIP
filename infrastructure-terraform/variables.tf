locals {
  development_account_id = "390773179818"
  qa_account_id          = "817206606893"
  production_account_id  = "186202231680"
  tf_role                = "terraform-role"
  external_id            = "EXTERNAL_ID"

  development_tf_role = "arn:aws:iam::${local.development_account_id}:role/${local.tf_role}"
  qa_tf_role          = "arn:aws:iam::${local.qa_account_id}:role/${local.tf_role}"
  production_tf_role  = "arn:aws:iam::${local.production_account_id}:role/${local.tf_role}"
}

variable "db_password" {
  description = "rds database password"
  type        = string
}
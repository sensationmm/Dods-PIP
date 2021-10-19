resource "aws_ssm_parameter" "db_user" {
  overwrite = true
  name  = "/infra/${var.environment}/rds/username"
  type  = "String"
  value = module.client-profile-database.db_username
}

resource "aws_ssm_parameter" "db_password" {
  overwrite = true
  name  = "/infra/${var.environment}/rds/password"
  type  = "String"
  value = module.client-profile-database.db_password
}

resource "aws_ssm_parameter" "db_endpoint" {
  overwrite = true
  name  = "/infra/${var.environment}/rds/endpoint"
  type  = "String"
  value = module.client-profile-database.db_address
}

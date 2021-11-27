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

resource "aws_ssm_parameter" "api_key_front" {
  overwrite = true
  name  = "/infra/${var.environment}/apikey/front"
  type  = "String"
  value = module.api-gateway.api_key_front
}

resource "aws_ssm_parameter" "api_key_test" {
  overwrite = true
  name  = "/infra/${var.environment}/apikey/test"
  type  = "String"
  value = module.api-gateway.api_key_test
}

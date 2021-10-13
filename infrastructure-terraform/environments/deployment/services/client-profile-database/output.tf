output "db_connection_string" {
  value = "${var.db_username}:${var.db_password}@${module.rds.db_endpoint}:3306/${module.rds.db_name}"
}

output "db_security_group" {
  value = module.rds.db_security_group
}

output "db_username" {
  value = module.rds.db_username
}

output "db_password" {
  value = module.rds.db_password
}

output "db_address" {
  value = module.rds.db_address
}
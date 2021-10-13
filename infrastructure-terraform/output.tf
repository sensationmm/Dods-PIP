output "subnet_private_development" {
  value = tolist(module.development.subnet_private)
}

output "subnet_private_qa" {
  value = module.qa.subnet_private
}

output "db_security_group_development" {
  value = module.development.db_security_group
}

output "db_security_group_qa" {
  value = module.qa.db_security_group
}

output "db_endpoint_dev" {
  value = module.development.db_connection
}

output "db_address_dev" {
  value = module.development.db_address
}
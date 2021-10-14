output "subnet_private_development" {
  value = tolist(module.dev.subnet_private)
}

output "subnet_private_qa" {
  value = module.qa.subnet_private
}

output "db_security_group_development" {
  value = module.dev.db_security_group
}

output "db_security_group_qa" {
  value = module.qa.db_security_group
}

output "db_endpoint_dev" {
  value = module.dev.db_connection
}

output "db_address_dev" {
  value = module.dev.db_address
}
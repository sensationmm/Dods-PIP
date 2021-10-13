//output output_example {
//  value = module.module_name.arn
//}
output "subnet_private" {
  value = tolist(module.vpc.private_subnet_ids)
}

output "db_security_group" {
  value = module.client-profile-database.db_security_group
}

output "db_connection" {
  value = module.client-profile-database.db_connection_string
}

output "db_address" {
  value = module.client-profile-database.db_address
}
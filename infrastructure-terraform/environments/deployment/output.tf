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

output "lambda_sg_id" {
  value = module.client-profile-database.lambda_sg_id
}

output "frontend_url" {
  value = module.pip-network.frontend_url
}

output "api_gateway" {
  value = module.api_gateway.api_gateway_id
}

output "api_root_res_id" {
  value = module.api_gateway.api_root_resource_id
}
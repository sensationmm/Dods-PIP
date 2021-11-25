output "dev_db_address" {
  description = "'Dev' Environment DB address"
  value       = module.dev.db_address
}

output "dev_db_bastion" {
  description = "'Dev' Environment DB bastion host"
  value       = module.dev.db_bastion_cx
}

output "dev_frontend_url" {
  description = "'Dev' Environment URL Frontend"
  value       = module.dev.frontend_url
}

output "dev_backend_url" {
  description = "'Dev' Environment Base URL Backend"
  value       = module.dev.api_url
}

// --------------------------------

output "prod_db_address" {
  description = "'Prod' Environment DB address"
  value       = module.production.db_address
}

output "prod_db_bastion" {
  description = "'Prod' Environment DB bastion host"
  value       = module.production.db_bastion_cx
}

output "prod_frontend_url" {
  description = "'Prod' Environment URL Frontend"
  value       = module.production.frontend_url
}

output "prod_backend_url" {
  description = "'Prod' Environment Base URL Backend"
  value       = module.production.api_url
}

// --------------------------------

output "qa_db_address" {
  description = "'qa' Environment DB address"
  value       = module.qa.db_address
}

output "qa_db_bastion" {
  description = "'qa' Environment DB bastion host"
  value       = module.qa.db_bastion_cx
}

output "qa_frontend_url" {
  description = "'qa' Environment URL Frontend"
  value       = module.qa.frontend_url
}

output "qa_backend_url" {
  description = "'qa' Environment Base URL Backend"
  value       = module.qa.api_url
}

// --------------------------------

output "test_db_address" {
  description = "'test' Environment DB address"
  value       = module.test.db_address
}

output "test_db_bastion" {
  description = "'test' Environment DB bastion host"
  value       = module.test.db_bastion_cx
}

output "test_frontend_url" {
  description = "'test' Environment URL Frontend"
  value       = module.test.frontend_url
}

output "test_backend_url" {
  description = "'test' Environment Base URL Backend"
  value       = module.test.api_url
}

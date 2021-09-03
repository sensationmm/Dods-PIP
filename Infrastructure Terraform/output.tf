output editor_development_cert_arn {
  value = module.dev-editor-certificates.arn
}

output editor_production_cert_arn {
  value = module.prod-editor-certificates.arn
}

output accounts {
  value = module.dev-devtools.accounts
}

output delegate_role_arn { //TODO - I suspect another of these may need to be created
  value = module.prod-delegate-access.delegate_role_arn
}

output production_ecr_details {
  value = module.prod-builder.builder_ecr_repository_details
}

output development_ecr_details {
  value = module.dev-builder.builder_ecr_repository_details
}

// ----------------------------------------------------------------------------------------------------------------
// - The following outputs are to be used for mettrrs parent account
// ----------------------------------------------------------------------------------------------------------------
output "production_gitlab_role_arn" {
  value = module.prod-cross-account-access.gitlab_role_arn
}

output "development_gitlab_role_arn" {
  value = module.dev-cross-account-access.gitlab_role_arn
}

output "production_parent_account_role_arn" {
  value = module.prod-cross-account-access.parent_account_role_arn
}

output "development_parent_account_role_arn" {
  value = module.dev-cross-account-access.parent_account_role_arn
}

output "production_build_store_arn" {
  value = module.prod-builder.build_store_arn
}

output "development_build_store_arn" {
  value = module.dev-builder.build_store_arn
}

output "production_agent_identity_pool_arn" {
  value = module.prod-editor.identity_pool_arn
}

output "development_agent_identity_pool_arn" {
  value = module.dev-editor.identity_pool_arn
}

output "production_website_editor_table_arn" {
  value = module.prod-cross-account-access.editor_table_arm
}

output "development_website_editor_table_arn" {
  value = module.dev-cross-account-access.editor_table_arm
}


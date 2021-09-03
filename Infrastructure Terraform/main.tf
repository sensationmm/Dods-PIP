// --------------------------------------------------------------------------------------------------------------------
// - Access
// --------------------------------------------------------------------------------------------------------------------
module "prod-delegate-access" {
  source               = "./modules/delegate-access"
  developer_account_id = local.development_account_id
  providers = {
    aws = aws.prod
  }
}

module "staging-delegate-access" {
  source               = "./modules/delegate-access"
  developer_account_id = local.development_account_id
  providers = {
    aws = aws.staging
  }
}

// --------------------------------------------------------------------------------------------------------------------
// - Development Tools
// --------------------------------------------------------------------------------------------------------------------
module "dev-devtools" {
  source      = "./modules/devtools"
  environment = "development"

  providers = {
    aws = aws.dev
  }
}

// --------------------------------------------------------------------------------------------------------------------
// - Certificates
// --------------------------------------------------------------------------------------------------------------------
module "prod-editor-certificates" {
  source      = "./modules/editor-certificates"
  environment = "production"
  providers = {
    aws = aws.prod-us-east-1
  }
}

module "staging-editor-certificates" {
  source      = "./modules/editor-certificates"
  environment = "staging"
  providers = {
    aws = aws.staging-us-east-1
  }
}

module "dev-editor-certificates" {
  source      = "./modules/editor-certificates"
  environment = "development"
  providers = {
    aws = aws.dev-us-east-1
  }
}

// --------------------------------------------------------------------------------------------------------------------
// - Editor Service
// --------------------------------------------------------------------------------------------------------------------
module "prod-editor" {
  source      = "./modules/editor"
  editor_table_name       = var.production_editor_table_name
  environment = "production"
  providers = {
    aws = aws.prod
  }
}

module "staging-editor" {
  source      = "./modules/editor"
  editor_table_name       = var.staging_editor_table_name
  environment = "staging"
  providers = {
    aws = aws.staging
  }
}

module "dev-editor" {
  source      = "./modules/editor"
  editor_table_name       = var.development_editor_table_name
  environment = "development"
  providers = {
    aws = aws.dev
  }
}

// --------------------------------------------------------------------------------------------------------------------
// - Website Builder
// --------------------------------------------------------------------------------------------------------------------
module "prod-builder" {
  source            = "./modules/builder"
  environment       = "production"
  builder_app_image = "${local.production_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/production-repository:latest"
  builder_arn       = local.builder_prod_task_role_arn
  account_id        = local.production_account_id
  endpoint          = local.production_editor_endpoint
  editor_table_name = var.production_editor_table_name
  providers = {
    aws = aws.prod
  }
}

module "staging-builder" {
  source            = "./modules/builder"
  environment       = "staging"
  builder_app_image = "${local.staging_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/staging-repository:latest"
  builder_arn       = local.builder_staging_task_role_arn
  account_id        = local.staging_account_id
  endpoint          = local.staging_editor_endpoint
  editor_table_name = var.staging_editor_table_name
  providers = {
    aws = aws.staging
  }
}

module "dev-builder" {
  source            = "./modules/builder"
  environment       = "development"
  builder_app_image = "${local.development_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/development-repository:latest"
  builder_arn       = local.builder_dev_task_role_arn
  account_id        = local.development_account_id
  endpoint          = local.development_editor_endpoint
  editor_table_name = var.development_editor_table_name
  providers = {
    aws = aws.dev
  }
}

// --------------------------------------------------------------------------------------------------------------------
// - "mettrr parent/root account access"
// --------------------------------------------------------------------------------------------------------------------
module "dev-cross-account-access" {
  source                  = "./modules/cross-account-access"
  environment             = "development"
  gitlab_user_arn         = "arn:aws:iam::${local.master_account_id}:user/gitlab"
  parent_account_user_arn = "arn:aws:iam::${local.master_account_id}:user/mettrr-staging"
  build_store_bucket      = module.dev-builder.build_store_arn
  agent_identity_pool     = module.dev-editor.identity_pool_arn
  editor_table_name       = var.development_editor_table_name
  submission_table_name   = module.dev-onboarding.submission_table_name
  providers = {
    aws = aws.dev
  }
}

module "staging-cross-account-access" {
  source                  = "./modules/cross-account-access"
  environment             = "staging"
  gitlab_user_arn         = "arn:aws:iam::${local.master_account_id}:user/gitlab"
  parent_account_user_arn = "arn:aws:iam::${local.master_account_id}:user/mettrr-builder"
  build_store_bucket      = module.staging-builder.build_store_arn
  agent_identity_pool     = module.staging-editor.identity_pool_arn
  editor_table_name       = var.staging_editor_table_name
  submission_table_name   = module.staging-onboarding.submission_table_name

  providers = {
    aws = aws.staging
  }
}

module "prod-cross-account-access" {
  source                  = "./modules/cross-account-access"
  environment             = "production"
  gitlab_user_arn         = "arn:aws:iam::${local.master_account_id}:user/gitlab"
  parent_account_user_arn = "arn:aws:iam::${local.master_account_id}:user/mettrr-builder"
  build_store_bucket      = module.prod-builder.build_store_arn
  agent_identity_pool     = module.prod-editor.identity_pool_arn
  editor_table_name       = var.production_editor_table_name
  submission_table_name   = module.prod-onboarding.submission_table_name
  providers = {
    aws = aws.prod
  }
}
// --------------------------------------------------------------------------------------------------------------------
// - onboarding
// --------------------------------------------------------------------------------------------------------------------
module "dev-onboarding" {
  source      = "./modules/onboarding"
  environment = "development"
  project     = "onboarding"
  providers = {
    aws = aws.dev
  }
}

module "staging-onboarding" {
  source      = "./modules/onboarding"
  environment = "staging"
  project     = "onboarding"
  providers = {
    aws = aws.staging
  }
}

module "prod-onboarding" {
  source      = "./modules/onboarding"
  environment = "production"
  project     = "onboarding"
  providers = {
    aws = aws.prod
  }
}

// --------------------------------------------------------------------------------------------------------------------
// - Central API Gateway
// --------------------------------------------------------------------------------------------------------------------
module "api-gateway" {
  source      = "./services/api-gateway"
  environment = var.environment
}

// --------------------------------------------------------------------------------------------------------------------
// - Client profile database
// --------------------------------------------------------------------------------------------------------------------
module "client-profile-database" {
  source      = "./services/client-profile-database"
  environment = var.environment

  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  public_subnet_ids  = module.vpc.public_subnet_ids
  cidr_block         = "172.17.0.0/16"
  ipv6_cidr_block    = module.vpc.ipv6_cidr_block
  db_password        = var.db_password
  db_username        = "admin"
}

// --------------------------------------------------------------------------------------------------------------------
// - Development Tools
// --------------------------------------------------------------------------------------------------------------------
module "devtools" {
  source      = "./services/devtools"
  environment = var.environment
}

// --------------------------------------------------------------------------------------------------------------------
// - Editorial Document
// --------------------------------------------------------------------------------------------------------------------
module "editorial" {
  source      = "./services/editorial"
  environment = var.environment
}

// --------------------------------------------------------------------------------------------------------------------
// - Extracted content
// --------------------------------------------------------------------------------------------------------------------
module "extracted-content" {
  source      = "./services/extracted-content"
  environment = var.environment
}

// --------------------------------------------------------------------------------------------------------------------
// - Migration
// --------------------------------------------------------------------------------------------------------------------
module "migration" {
  source      = "./services/migration"
  environment = var.environment
}

// --------------------------------------------------------------------------------------------------------------------
// - Alerts
// --------------------------------------------------------------------------------------------------------------------
module "alerts" {
  source      = "./services/alerts"
  environment = var.environment
}

// --------------------------------------------------------------------------------------------------------------------
// - Taxonomy Resources
// --------------------------------------------------------------------------------------------------------------------
module "taxonomy" {
  source      = "./services/taxonomy"
  environment = var.environment
}

// --------------------------------------------------------------------------------------------------------------------
// - Primary PIP Frontend Network
// --------------------------------------------------------------------------------------------------------------------
module "pip-network" {
  source      = "./services/pip-network"
  environment = var.environment

  app_image          = var.app_image
  api_gateway        = module.api-gateway.api_gateway_url
  api_taxonomy       = module.taxonomy.taxonomy-api
  fe_api_key         = module.api-gateway.api_key_front
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  public_subnet_ids  = module.vpc.public_subnet_ids
}


// --------------------------------------------------------------------------------------------------------------------
// - Main VPC
// --------------------------------------------------------------------------------------------------------------------
module "vpc" {
  source      = "./services/vpc"
  environment = var.environment
}

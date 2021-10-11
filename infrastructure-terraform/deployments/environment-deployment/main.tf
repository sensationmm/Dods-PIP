// --------------------------------------------------------------------------------------------------------------------
// - Development Tools
// --------------------------------------------------------------------------------------------------------------------
module "devtools" {
  source      = "./services/devtools"
  environment = var.environment
}

// --------------------------------------------------------------------------------------------------------------------
// - Main VPC
// --------------------------------------------------------------------------------------------------------------------
module "vpc" {
  source      = "./services/vpc"
  environment = var.environment
}

// --------------------------------------------------------------------------------------------------------------------
// - Primary PIP Frontend Network
// --------------------------------------------------------------------------------------------------------------------
module "pip-network" {
  source    = "./services/pip-network"
  environment = var.environment

  app_image = var.app_image
  vpc_id = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  public_subnet_ids = module.vpc.public_subnet_ids
}

// --------------------------------------------------------------------------------------------------------------------
// - Primary PIP Network
// --------------------------------------------------------------------------------------------------------------------
module "client-profile-database" {
  source    = "./services/client-profile-database"
  environment = var.environment

  vpc_id = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  public_subnet_ids = module.vpc.public_subnet_ids
  cidr_block = module.vpc.cidr_block
  ipv6_cidr_block = module.vpc.ipv6_cidr_block
}

// --------------------------------------------------------------------------------------------------------------------
// - Editorial Document
// --------------------------------------------------------------------------------------------------------------------
module "editorial" {
  source    = "./services/editorial"
  environment = var.environment
}



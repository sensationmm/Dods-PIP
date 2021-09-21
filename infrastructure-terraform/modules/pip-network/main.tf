// --------------------------------------------------------------------------------------------------------------------
// - VPC
// --------------------------------------------------------------------------------------------------------------------
module "vpc" {
  environment = var.environment
  source      = "./modules/vpc"
}

// --------------------------------------------------------------------------------------------------------------------
// - Builder primary work cluster
// --------------------------------------------------------------------------------------------------------------------
module "ecs" {
  environment             = var.environment
  project                 = var.project
  source                  = "./modules/fargate"
  aws_region              = var.aws_region


  //vpc variables
  vpc_id                  = module.vpc.vpc_id
  private_subnet_ids      = module.vpc.private_subnet_ids
  public_subnet_ids       = module.vpc.public_subnet_ids
  availability_zone_names = module.vpc.availability_zone_names
  az_count                = module.vpc.az_count

  //variables for iam policies


  //container variables
  app_image       = var.app_image


  //new queue variables
  minimum_container_count = 0
  maximum_container_count = 1
  log_group_name          = "pip-frontend"
}
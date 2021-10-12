// --------------------------------------------------------------------------------------------------------------------
// - Builder primary work cluster
// --------------------------------------------------------------------------------------------------------------------
module "ecs" {
  environment = var.environment
  project     = var.project
  source      = "./modules/fargate"
  aws_region  = var.aws_region


  //vpc variables
  vpc_id                  = var.vpc_id
  private_subnet_ids      = var.private_subnet_ids
  public_subnet_ids       = var.public_subnet_ids
  availability_zone_names = var.availability_zone_names
  az_count                = var.az_count

  //variables for iam policies


  //container variables
  app_image = var.app_image


  //new queue variables
  minimum_container_count = 0
  maximum_container_count = 1
  log_group_name          = "pip-frontend"
}
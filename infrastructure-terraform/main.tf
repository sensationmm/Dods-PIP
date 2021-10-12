// --------------------------------------------------------------------------------------------------------------------
// - Dev environment
// --------------------------------------------------------------------------------------------------------------------
module "development" {
  source      = "./environments/deployment"
  environment = "development"
  app_image   = "390773179818.dkr.ecr.eu-west-1.amazonaws.com/dods-pip/frontend-dods-pip:639732e4f367758bb6eddb333fc5f620b4d80029"
  account_id  = "390773179818"
  db_password = var.db_password
  providers = {
    aws = aws.dev
  }
}

// --------------------------------------------------------------------------------------------------------------------
// - prod environment
// --------------------------------------------------------------------------------------------------------------------
module "production" {
  source      = "./environments/deployment"
  environment = "production"
  app_image   = "186202231680.dkr.ecr.eu-west-1.amazonaws.com/dods-pip/frontend-dods-pip:" //non existent
  account_id  = "186202231680"
  db_password = var.db_password
  providers = {
    aws = aws.prod
  }
}

// --------------------------------------------------------------------------------------------------------------------
// - qa environment
// --------------------------------------------------------------------------------------------------------------------
module "qa" {
  source      = "./environments/deployment"
  environment = "qa"
  app_image   = "817206606893.dkr.ecr.eu-west-1.amazonaws.com/dods-pip/frontend-dods-pip:" //non existent
  account_id  = "817206606893"
  db_password = var.db_password
  providers = {
    aws = aws.qa
  }
}
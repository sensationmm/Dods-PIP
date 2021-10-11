// --------------------------------------------------------------------------------------------------------------------
// - Dev environment
// --------------------------------------------------------------------------------------------------------------------
module "development" {
  source      = "./environments/deployment"
  environment = "development"
  app_image   = "390773179818.dkr.ecr.eu-west-1.amazonaws.com/dods-pip/frontend-dods-pip:639732e4f367758bb6eddb333fc5f620b4d80029"
  account_id  = "390773179818"

}



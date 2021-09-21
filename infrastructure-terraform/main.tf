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
// - Primary PIP Frontend Network
// --------------------------------------------------------------------------------------------------------------------
module "dev-pip-network" {
  source    = "./modules/pip-network"
  providers = {
    aws = aws.dev
  }
  environment                 = "development"
  app_image = "390773179818.dkr.ecr.eu-west-1.amazonaws.com/dods-pip/frontend-dods-pip:639732e4f367758bb6eddb333fc5f620b4d80029"

}

// --------------------------------------------------------------------------------------------------------------------
// - Primary PIP Network
// --------------------------------------------------------------------------------------------------------------------
module "dev-client-profile-database" {
  source    = "./modules/client-profile-database"
  providers = {
    aws = aws.dev
  }
  environment = "development"
}

// --------------------------------------------------------------------------------------------------------------------
// - Editorial Document
// --------------------------------------------------------------------------------------------------------------------
module "dev-editorial-document" {
  source    = "./modules/editorial"
  providers = {
    aws = aws.dev
  }
  environment = "development"
}

// --------------------------------------------------------------------------------------------------------------------
// - "Cross account access"
// --------------------------------------------------------------------------------------------------------------------
//module "prod-cross-account-access" {
//  source                  = "./modules/cross-account-access"
//  environment             = "production"
//  providers = {
//    aws = aws.prod
//  }
//}



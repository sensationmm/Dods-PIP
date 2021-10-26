terraform {
  required_version = "~> 1.0.8"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.62.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.1.0"
    }
  }
}

// --------------------------------------------------------------------------------------------------------------------
// - Dev environment
// --------------------------------------------------------------------------------------------------------------------
module "dev" {
  source      = "./environments/deployment"
  environment = "dev"
  app_image   = "390773179818.dkr.ecr.eu-west-1.amazonaws.com/dods-pip/frontend-dods-pip:16b08e28e248eb993a5701b44788dc26bfecd399"
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
  #  app_image   = "817206606893.dkr.ecr.eu-west-1.amazonaws.com/dods-pip/frontend:" //non existent
  app_image   = "817206606893.dkr.ecr.eu-west-1.amazonaws.com/pip/frontend:3cd393ea57c29d570f13272ee00b1c7822b3e7c8"
  account_id  = "817206606893"
  db_password = var.db_password
  providers = {
    aws = aws.qa
  }
}

// --------------------------------------------------------------------------------------------------------------------
// - test environment
// --------------------------------------------------------------------------------------------------------------------
module "test" {
  source      = "./environments/deployment"
  environment = "test"
  app_image   = "072266309162.dkr.ecr.eu-west-1.amazonaws.com/dods-pip/frontend-dods-pip:" //non existent
  account_id  = "072266309162"
  db_password = var.db_password
  providers = {
    aws = aws.test
  }
}
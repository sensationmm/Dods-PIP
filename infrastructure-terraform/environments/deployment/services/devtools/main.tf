// --------------------------------------------------------------------------------------------------------------------
// - Component Storybook
// --------------------------------------------------------------------------------------------------------------------
module "storybook" {
  source      = "./modules/s3"
  environment = var.environment
  name        = "storybook"
}

// --------------------------------------------------------------------------------------------------------------------
// - Scrapping Lambda bucket
// --------------------------------------------------------------------------------------------------------------------
module "scrapping" {
  source      = "./modules/s3"
  environment = var.environment
  name        = "scrapping-lambdas"
}

// --------------------------------------------------------------------------------------------------------------------
// - Services Lambda bucket
// --------------------------------------------------------------------------------------------------------------------
module "services" {
  source      = "./modules/s3"
  environment = var.environment
  name        = "services-lambdas"
}
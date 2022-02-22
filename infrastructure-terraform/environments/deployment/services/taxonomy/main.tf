// --------------------------------------------------------------------------------------------------------------------
// - taxonomy-data
// --------------------------------------------------------------------------------------------------------------------
module "taxonomy-data" {
  source      = "./modules/s3"
  environment = var.environment
  name        = "taxonomy-trees"
}

module "taxonomy-api" {
  source = "./modules/api-gateway"
  environment = var.environment
  taxonomy_bucket = module.taxonomy-data.taxonomy-bucket-name
}
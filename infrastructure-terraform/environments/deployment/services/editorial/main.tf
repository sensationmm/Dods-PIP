// --------------------------------------------------------------------------------------------------------------------
// - Editorial Document Store
// --------------------------------------------------------------------------------------------------------------------
module "editorial-document-store" {
  source      = "./modules/s3"
  environment = var.environment
  name        = "editorial-doc-store"
}

// --------------------------------------------------------------------------------------------------------------------
// - Editorial Record Archive
// --------------------------------------------------------------------------------------------------------------------
module "editorial-record-archive" {
  source      = "./modules/s3"
  environment = var.environment
  name        = "editorial-record-archive"
}

// --------------------------------------------------------------------------------------------------------------------
// - Editorial Record database
// --------------------------------------------------------------------------------------------------------------------
module "editorial-record-dynamodb" {
  source      = "./modules/dynamodb"
  environment = var.environment
  name        = "editorial-records"
}
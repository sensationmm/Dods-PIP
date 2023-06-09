// --------------------------------------------------------------------------------------------------------------------
// - Extracted content HOC debates ingestion content transform queue
// --------------------------------------------------------------------------------------------------------------------
module "hoc-debates-ingestion-content-transform-queue" {
  source      = "./modules/sqs"
  environment = var.environment
  queue_name  = "hoc-debates-ingestion-content-transform-queue"
}

// --------------------------------------------------------------------------------------------------------------------
// - Bucket for scraped content
// --------------------------------------------------------------------------------------------------------------------
module "scraped-content" {
  source      = "./modules/s3"
  environment = var.environment
  name        = "content-extraction"
}

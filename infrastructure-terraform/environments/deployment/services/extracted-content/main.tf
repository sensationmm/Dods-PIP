// --------------------------------------------------------------------------------------------------------------------
// - Extracted content HOC debates ingestion content transform queue
// --------------------------------------------------------------------------------------------------------------------
module "migration-stage-1-sqs-queue" {
  source      = "./modules/sqs"
  environment = var.environment
  queue_name  = "hoc-debates-ingestion-content-transform-queue"
}


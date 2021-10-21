// --------------------------------------------------------------------------------------------------------------------
// - Migration stage 1. inout storage
// --------------------------------------------------------------------------------------------------------------------
module "migration-stage-1-s3-input" {
  source      = "./modules/s3"
  environment = var.environment
  name        = "migration-input"
}

// --------------------------------------------------------------------------------------------------------------------
// - Migration stage 1 sqs queue
// --------------------------------------------------------------------------------------------------------------------
module "migration-stage-1-sqs-queue" {
  source      = "./modules/sqs"
  environment = var.environment
  queue_name  = "migration-stage-1-queue"
}
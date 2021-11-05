// --------------------------------------------------------------------------------------------------------------------
// - Migration stage 1. input storage
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


// --------------------------------------------------------------------------------------------------------------------
// - Migration stage 1. output storage
// --------------------------------------------------------------------------------------------------------------------
module "migration-stage-1-s3-output" {
  source      = "./modules/s3"
  environment = var.environment
  name        = "migration-stage-1-output"
}

// --------------------------------------------------------------------------------------------------------------------
// - Migration stage 2 sqs queue
// --------------------------------------------------------------------------------------------------------------------
module "migration-stage-2-sqs-queue" {
  source      = "./modules/sqs"
  environment = var.environment
  queue_name  = "migration-stage-2-queue"
}

// --------------------------------------------------------------------------------------------------------------------
// - Migration stage 2. output storage
// --------------------------------------------------------------------------------------------------------------------
module "migration-stage-2-s3-output" {
  source      = "./modules/s3"
  environment = var.environment
  name        = "migration-stage-2-output"
}

// --------------------------------------------------------------------------------------------------------------------
// - Migration stage 3. sqs queue for  list lambda for converting Taxonomy
// --------------------------------------------------------------------------------------------------------------------
module "migration-stage-3-sqs-queue" {
  source      = "./modules/sqs"
  environment = var.environment
  queue_name  = "migration-stage-3-queue"
}

// --------------------------------------------------------------------------------------------------------------------
// - Migration stage 3. misses storage
// --------------------------------------------------------------------------------------------------------------------
module "migration-stage-3-s3-misses" {
  source      = "./modules/s3"
  environment = var.environment
  name        = "migration-stage-3-misses"
}
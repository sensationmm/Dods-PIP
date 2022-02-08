// --------------------------------------------------------------------------------------------------------------------
// - alerts (Collections feature) sqs queue
// --------------------------------------------------------------------------------------------------------------------
module "instant-alert-sqs-queue" {
  source      = "./modules/sqs"
  environment = var.environment
  queue_name  = "instant-alert-queue"
}

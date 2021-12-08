locals {
  main_resource_name = var.queue_name
  owner              = "michael brown"
  prefix             = "${var.project}-${var.environment}-${local.main_resource_name}"

  common_tags = {
    Version     = "1"
    Environment = var.environment
    Project     = var.project
    ManagedBy   = "terraform"
    Owner       = local.owner
  }
}

resource "aws_sqs_queue" "queue" {
  name                        = "${local.prefix}.fifo"
  fifo_queue                  = true
  content_based_deduplication = true


  tags = local.common_tags
}

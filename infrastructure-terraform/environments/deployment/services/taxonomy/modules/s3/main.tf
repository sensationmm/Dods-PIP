locals {
  bucket_name = "${var.project}-${var.environment}-${var.name}"
}

resource "aws_s3_bucket" "bucket" {
  bucket = local.bucket_name
  acl    = "private"

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  tags = {
    environment = var.environment
    project     = var.project
    version     = "1"
    owner       = "michael brown"
    managedBy   = "terraform"
  }
  policy = templatefile("${path.module}/templates/bucket-policy.tpl", {
    bucket_name = local.bucket_name
  })
}

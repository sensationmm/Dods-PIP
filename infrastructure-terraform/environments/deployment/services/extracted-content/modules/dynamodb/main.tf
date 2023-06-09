resource "aws_dynamodb_table" "table" {
  name         = "${var.name}-${var.environment}-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = var.partition-key

  ttl {
    attribute_name = "timeToLive"
    enabled        = true
  }

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Version     = "1"
    Environment = var.environment
    Project     = var.name
    ManagedBy   = "terraform"
    Owner       = "michael.brown@somoglobal.com"
  }
}
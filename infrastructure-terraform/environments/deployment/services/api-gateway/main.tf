// --------------------------------------------------------------------------------------------------------------------
// - API Gateway
// --------------------------------------------------------------------------------------------------------------------
locals {
  main_resource_name = "backend"
}

resource "aws_api_gateway_rest_api" "backend" {
  name  = "${var.project}-${var.environment}-${local.main_resource_name}-api"
  api_key_source = "HEADER"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}




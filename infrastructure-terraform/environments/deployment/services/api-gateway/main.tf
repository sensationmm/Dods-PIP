// --------------------------------------------------------------------------------------------------------------------
// - API Gateway
// --------------------------------------------------------------------------------------------------------------------
locals {
  main_resource_name = "backend"
}

resource "aws_api_gateway_rest_api" "backend" {
  name           = "${var.project}-${var.environment}-${local.main_resource_name}-api"
  api_key_source = "HEADER"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_api_key" "frontend-client" {
  name        = "frontend"
  description = "API key meant to be used from the frontend"
}

resource "aws_api_gateway_api_key" "testing" {
  name        = "testers"
  description = "API key meant to be used from the CLI and testing"
}


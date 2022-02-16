output "api_gateway_id" {
  value = aws_api_gateway_rest_api.backend.id
}

output "api_root_resource_id" {
  value = aws_api_gateway_rest_api.backend.root_resource_id
}

output "api_key_front" {
  value = aws_api_gateway_api_key.frontend-client.value
}

output "api_key_test" {
  value = aws_api_gateway_api_key.testing.value
}

output "api_gateway_url" {
  value = "https://${aws_api_gateway_rest_api.backend.id}.execute-api.${var.aws_region}.amazonaws.com/${var.environment}"
}

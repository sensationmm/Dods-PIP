output "api_gateway_id" {
  value = aws_api_gateway_rest_api.backend.id
}

output "api_root_resource_id" {
  value = aws_api_gateway_rest_api.backend.root_resource_id
}
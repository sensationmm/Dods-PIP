output "api_gateway_id" {
  value = aws_api_gateway_rest_api.taxonomy.id
}

output "api_key_front" {
  value     = aws_api_gateway_api_key.taxonomy-client.value
  sensitive = true
}

output "api_gateway_url" {
  value = aws_api_gateway_deployment.taxonomy-deployment.invoke_url
}

output "app_image" {
  value = data.aws_ssm_parameter.stored-frontend-image.value
}
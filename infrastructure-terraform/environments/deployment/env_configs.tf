data "template_file" "vpc_config_dev" {
  template = file("${path.module}/../../templates/vpc.js.tpl")
  vars = {
    securityGroupIds = jsonencode([module.client-profile-database.lambda_sg_id])
    subnetIds        = jsonencode(module.vpc.private_subnet_ids)
  }
}

data "template_file" "env_config" {
  template = file("${path.module}/../../templates/env-config.js.tpl")
  vars = {
    environment       = var.environment
    securityGroupIds  = jsonencode([module.client-profile-database.lambda_sg_id])
    subnetIds         = jsonencode(module.vpc.private_subnet_ids)
    apiGatewayId      = jsonencode(module.api_gateway.api_gateway_id)
    apiRootResourceId = jsonencode(module.api_gateway.api_root_resource_id)
    frontendURL       = jsonencode(module.pip-network.frontend_url)
  }
}

resource "local_file" "vpc_config" {
  filename = "${path.module}/../../vpc.${var.environment}.js"
  content  = data.template_file.vpc_config_dev.rendered
}

resource "local_file" "env_config" {
  filename = "${path.module}/../../env-config.${var.environment}.js"
  content  = data.template_file.env_config.rendered
}




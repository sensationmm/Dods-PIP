data "template_file" "vpc_config_dev" {
  template = file("${path.module}/../../templates/vpc.js.tpl")
  vars = {
    securityGroupIds = jsonencode([module.client-profile-database.lambda_sg_id])
    subnetIds = jsonencode(module.vpc.public_subnet_ids)
  }
}

resource "local_file" "vpc_config" {
  filename = "${path.module}/../../vpc.${var.environment}.js"
  content  = data.template_file.vpc_config_dev.rendered


}


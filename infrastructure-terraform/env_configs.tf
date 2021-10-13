data "template_file" "vpc_config_dev" {
  template = file("${path.module}/templates/vpc.js.tpl")
  vars = {
    securityGroupIds = jsonencode(module.development.db_security_group)
    subnetIds = jsonencode( module.development.subnet_private )
  }
}

data "template_file" "vpc_config_qa" {
  template = file("${path.module}/templates/vpc.js.tpl")
  vars = {
    securityGroupIds = jsonencode(module.qa.db_security_group)
    subnetIds = jsonencode(module.qa.subnet_private)
  }
}

resource "local_file" "vpc_config_dev" {
  filename = "${path.module}/vpc.dev.js"
  content  = data.template_file.vpc_config_dev.rendered
}

resource "local_file" "vpc_config_qa" {
  filename = "${path.module}/vpc.qa.js"
  content  = data.template_file.vpc_config_qa.rendered
}


locals {
  main_resource_name = "clients"
}

resource "aws_db_instance" "default" {
  allocated_storage     = 30
  engine                = var.db_engine
  engine_version        = var.engine_version
  instance_class        = var.instance_class
  name                  = "${var.project}-${var.environment}-${local.main_resource_name}-rds"
  username              = var.db_username
  password              = var.db_password
  parameter_group_name  = "default.mysql5.7"
  skip_final_snapshot   = true
  identifier            = var.identifier
  storage_type          = var.storage_type


  vpc_security_group_ids = [
    var.sec_grp_rds,
  ]

  db_subnet_group_name  = aws_db_subnet_group.db_sub_gr.id
  storage_encrypted     = false
  publicly_accessible   = true
  multi_az              = false

  tags {
    environment = var.environment
    project     = var.project
    version     = "1"
    owner       = "michael brown"
    managedBy   = "terraform"
  }
}
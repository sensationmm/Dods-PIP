locals {
  main_resource_name = "clients"
}

resource "aws_security_group" "rds_security_group" {
  name        = "rds_security_group"
  description = "Allow TLS inbound traffic"
  vpc_id      = var.vpc_id

  ingress {
      description      = "TLS from VPC"
      from_port        = 443
      to_port          = 443
      protocol         = "tcp"
      cidr_blocks      = [var.cidr_block]
      ipv6_cidr_blocks = [var.ipv6_cidr_block]
    }


  egress {
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = ["::/0"]
    }

  tags = merge(map(
    "name", "${var.project}-${var.environment}-${local.main_resource_name}-sg",
    "environment", var.environment,
    "project", var.project
    ), var.default_tags)
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
    aws_security_group.rds_security_group.id,
  ]


  storage_encrypted     = false
  publicly_accessible   = true
  multi_az              = false

  tags = {
    environment = var.environment
    project     = var.project
    version     = "1"
    owner       = "michael brown"
    managedBy   = "terraform"
  }
}
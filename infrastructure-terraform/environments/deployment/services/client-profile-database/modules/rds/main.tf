locals {
  main_resource_name = "clients"
}

resource "aws_security_group" "rds_security_group" {
  name        = "rds_security_group"
  description = "Allow TLS inbound traffic"
  vpc_id      = var.vpc_id


  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(tomap({
    "name"        = "${var.project}-${var.environment}-${local.main_resource_name}-sg",
    "owner"       = local.owner,
    "environment" = var.environment,
    "project"     = var.project
  }), var.default_tags)

}

resource "aws_db_subnet_group" "default" {
  name       = "main"
  subnet_ids = var.public_subnet_ids

  tags = {
    Name = "My DB subnet group"
  }
}

resource "aws_db_parameter_group" "default" {
  name        = "mariadb-params"
  family      = "mariadb10.3"
  description = "MariaDB parameter group"

  parameter {
    name  = "max_allowed_packet"
    value = "16777216"
  }
}

resource "aws_db_instance" "default" {
  db_subnet_group_name = "main"
  allocated_storage    = 50
  engine               = var.db_engine
  engine_version       = var.engine_version
  instance_class       = var.instance_class
  name                 = "${var.project}${var.environment}${local.main_resource_name}rds"
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = "mariadb-params"
  skip_final_snapshot  = true
  identifier           = var.identifier
  storage_type         = var.storage_type


  vpc_security_group_ids = [
    aws_security_group.rds_security_group.id,
  ]


  storage_encrypted   = false
  publicly_accessible = true
  multi_az            = false

  tags = {
    environment = var.environment
    project     = var.project
    version     = "1"
    owner       = "michael brown"
    managedBy   = "terraform"
  }
}

output "db_endpoint" {
  value = aws_db_instance.default.endpoint
}

output "db_name" {
  value = aws_db_instance.default.name
}

output "db_security_group" {
  value = aws_security_group.rds_security_group.id
}

output "db_username" {
  value = aws_db_instance.default.username
}

output "db_password" {
  value = aws_db_instance.default.password
}

output "db_address" {
  value = aws_db_instance.default.address
}
locals {
  main_resource_name = "clients"
}

resource "aws_security_group" "ssh" {
  vpc_id = var.vpc_id
  name   = "${var.project}-${var.environment}-bastion-sg"

  ingress {
    from_port   = 22
    protocol    = "tcp"
    to_port     = 22
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    protocol    = "-1"
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_key_pair" "bastion" {
  key_name   = "bastion-key"
  public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDIrNnBD3kVn6XmSLLKTZ0ukeiZRb3r9Gigjx8B/31emEeedPoeZEKQzkYhFBjrhc/Vwm2IuiX9eJh+4HvwH6T3rJWT+/PnmhOJS4H48bDk9xu1t+lV73YdVzqfCuAxZl0hMesIOtv2QH8TniEftH2ZtwzzA/7VtYl1KumUhdZvJVvyk73iW0n71o8SHoDrz0pRXj0jnsRWVrDAiMnS8OYJhrwMlQoHMs1IC3eoDShllLAcRTtN8tr3kMbDJlOKX+A3gHx+cGAstf+iXY0nTRauMEEZjte9m6AJII9zgWHv724pnT7l5JZCrqz6vGBWmUgpju1a1b2iB0kPnAkwx2p7"
}

resource "aws_instance" "bastion_host" {
  ami                         = "ami-0874dad5025ca362c"
  instance_type               = "t3.micro"
  vpc_security_group_ids      = [aws_security_group.ssh.id]
  subnet_id                   = var.public_subnet_ids[0]
  associate_public_ip_address = true

  key_name = aws_key_pair.bastion.key_name

  root_block_device {
    volume_type = "gp2"
    volume_size = 100
    encrypted   = true
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y mariadb-client"
    ]

    connection {
      type        = "ssh"
      user        = "admin"
      host        = self.public_ip
      private_key = file("~/.ssh/${var.bastion_host_key_pair_name}.pem")
    }
  }

  tags = {
    Name = "${local.main_resource_name}-bastion-host"
  }
}

resource "aws_security_group" "lambda" {
  vpc_id = var.vpc_id
  name   = "${var.project}-${var.environment}-lambda-sg"

  egress {
    from_port   = 0
    protocol    = "-1"
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "rds_security_group" {
  name        = "${var.project}-${var.environment}-rds-sg"
  description = "Allow MariaDB inbound traffic"
  vpc_id      = var.vpc_id

  ingress {
    description     = "MariaDB"
    from_port       = 3306
    protocol        = "tcp"
    to_port         = 3306
    security_groups = [aws_security_group.lambda.id, aws_security_group.ssh.id]
  }

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
  name       = "main-${var.environment}"
  // subnet_ids = var.public_subnet_ids
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "RDS instance subnet group"
  }
}

resource "aws_db_parameter_group" "default" {
  name        = "mariadb-params-${var.environment}"
  family      = "mariadb10.3"
  description = "MariaDB parameter group"

  parameter {
    name  = "max_allowed_packet"
    value = "16777216"
  }
}

resource "aws_db_instance" "default" {
  db_subnet_group_name = aws_db_subnet_group.default.name
  allocated_storage    = 50
  engine               = var.db_engine
  engine_version       = var.engine_version
  instance_class       = var.instance_class
  name                 = "${var.project}_${var.environment}"
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = aws_db_parameter_group.default.name
  skip_final_snapshot  = true
  identifier           = "${var.project}-${var.environment}-${local.main_resource_name}-rds"
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

// Output the ssh command for quick access
output "ssh_cmd" {
  value = "ssh -i ~/.ssh/${var.bastion_host_key_pair_name}.pem admin@${aws_instance.bastion_host.public_ip}"
}

output "lambda_sg_id" {
  value = aws_security_group.lambda.id
}
// --------------------------------------------------------------------------------------------------------------------
// - Network
// - Create var.az_count private subnets, each in a different AZ
// - Create var.az_count public subnets, each in a different AZ
// - IGW for the public subnet
// --------------------------------------------------------------------------------------------------------------------
data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  main_resource_name = "fargate"
}

resource "aws_vpc" "main" {
  cidr_block           = "172.17.0.0/16"
  enable_dns_hostnames = "true"
  enable_dns_support   = "true"

  tags = merge(tomap({
    "name"        = "${var.project}-${var.environment}-${local.main_resource_name}-vpc",
    "owner"       = local.owner,
    "environment" = var.environment,
    "project"     = var.project
  }), var.default_tags)
}

resource "aws_subnet" "private" {
  count             = var.az_count
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  vpc_id            = aws_vpc.main.id
  tags = merge(tomap({
    "name"        = "${var.project}-${var.environment}-${local.main_resource_name}-private",
    "owner"       = local.owner,
    "environment" = var.environment,
    "project"     = var.project
  }), var.default_tags)
}

resource "aws_subnet" "public" {
  count                   = var.az_count
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, var.az_count + count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  vpc_id                  = aws_vpc.main.id
  map_public_ip_on_launch = true
  tags = merge(tomap({
    "name"        = "${var.project}-${var.environment}-${local.main_resource_name}-public",
    "owner"       = local.owner,
    "environment" = var.environment,
    "project"     = var.project
  }), var.default_tags)
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  tags = merge(tomap({
    "name"        = "${var.project}-${var.environment}-${local.main_resource_name}-igw",
    "owner"       = local.owner,
    "environment" = var.environment,
    "project"     = var.project
  }), var.default_tags)
}

// - Route the public subnet traffic through the IGW
resource "aws_route" "internet_access" {
  route_table_id         = aws_vpc.main.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.gw.id
}

// - Create a NAT gateway with an EIP for each private subnet to get internet connectivity
//resource "aws_instance" "nat_Instance" {
//  count      = var.az_count
//  ami           = data.aws_ami.amazon_linux_2.id
//  instance_type = "t3.nano"
//
//  network_interface {
//    network_interface_id =  element(aws_network_interface.nat_Instance.*.id, count.index)
//    device_index         = 0
//  }
//  user_data = file("nat_startup.sh")
//
//  tags = merge(map(
//  "name", "${var.project}-${var.environment}-${local.main_resource_name}-nat-instance-${count.index}",
//  "owner", local.owner,
//  "environment", var.environment,
//  "project", var.project
//  ), var.default_tags)
//}

//resource "aws_security_group" "nat_instance" {
//  name        = "${var.project}-${var.environment}-${local.main_resource_name}-nat-instance-sg"
//  description = "allows outbound traffic from private subnet"
//  vpc_id = aws_vpc.main.id
//
//  egress {
//    from_port   = 443
//    to_port     = 443
//    protocol    = "tcp"
//    cidr_blocks = ["0.0.0.0/0"]
//  }
//
//  egress {
//    protocol        = "tcp"
//    from_port       = 80
//    to_port         = 80
//    cidr_blocks = ["0.0.0.0/0"]
//  }
//
//  ingress {
//    protocol        = "tcp"
//    from_port       = 443
//    to_port         = 443
//    cidr_blocks = ["172.17.0.0/16"]
//  }
//
//  ingress {
//    protocol        = "tcp"
//    from_port       = 80
//    to_port         = 80
//    cidr_blocks = ["172.17.0.0/16"]
//  }
//
//  tags = merge(map(
//  "name", "${var.project}-${var.environment}-${local.main_resource_name}-nat-instance-sg",
//  "owner", local.owner,
//  "environment", var.environment,
//  "project", var.project
//  ), var.default_tags)
//}


data "aws_ami" "amazon_linux_2" {
  most_recent = true

  filter {
    name   = "name"
    values = ["*amzn2-ami-hvm-2.0*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["amazon"]
}

//resource "aws_network_interface" "nat_Instance" {
//  count      = var.az_count
//  subnet_id   = element(aws_subnet.public.*.id, count.index)
//  source_dest_check = false
//  security_groups = [aws_security_group.nat_instance.id]
//
//  tags = {
//    name        = "${var.project}-${var.environment}-${local.main_resource_name}-primary-network-interface",
//    owner       =  local.owner,
//    environment = var.environment,
//    project     = var.project
//  }
//}

//resource "aws_eip" "NAT_Instance" {
//  count      = var.az_count
//  vpc        = true
//  depends_on = [aws_internet_gateway.gw]
//  tags = merge(map(
//    "name", "${var.project}-${var.environment}-${local.main_resource_name}-eip",
//    "owner", local.owner,
//    "environment", var.environment,
//    "project", var.project
//  ), var.default_tags)
//}

resource "aws_vpc_endpoint" "dynamodb" {
  vpc_id       = aws_vpc.main.id
  service_name = "com.amazonaws.eu-west-1.dynamodb"
}
resource "aws_vpc_endpoint" "s3" {
  vpc_id       = aws_vpc.main.id
  service_name = "com.amazonaws.eu-west-1.s3"
}

resource "aws_security_group" "privatelink" {
  name        = "${var.project}-${var.environment}-${local.main_resource_name}-privatelink-sg"
  description = "controls access to the AWS PrivateLink"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol         = "tcp"
    from_port        = 443
    to_port          = 443
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    protocol         = "tcp"
    from_port        = 80
    to_port          = 80
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    protocol         = "tcp"
    from_port        = 80
    to_port          = 80
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(tomap({
    "name"        = "${var.project}-${var.environment}-${local.main_resource_name}-privatelink-sg",
    "owner"       = local.owner,
    "environment" = var.environment,
    "project"     = var.project
  }), var.default_tags)

}

//resource "aws_vpc_endpoint" "sqs" {
//  vpc_id              = aws_vpc.main.id
//  service_name        = "com.amazonaws.eu-west-1.sqs"
//  vpc_endpoint_type   = "Interface"
//  private_dns_enabled = "true"
//
//  subnet_ids = aws_subnet.private.*.id
//
//  security_group_ids = [
//    "${aws_security_group.privatelink.id}"
//  ]
//
//  tags = merge(map(
//    "name", "${var.project}-${var.environment}-${local.main_resource_name}-sqs-endpoint",
//    "owner", local.owner,
//    "environment", var.environment,
//    "project", var.project
//  ), var.default_tags)
//  depends_on = [aws_security_group.privatelink]
//}

resource "aws_vpc_endpoint" "logs" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.eu-west-1.logs"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = "true"

  subnet_ids = aws_subnet.private.*.id

  security_group_ids = [
    "${aws_security_group.privatelink.id}"
  ]
  tags = merge(tomap({
    "name"        = "${var.project}-${var.environment}-${local.main_resource_name}-cloudwatch-logs-endpoint",
    "owner"       = local.owner,
    "environment" = var.environment,
    "project"     = var.project
  }), var.default_tags)

  depends_on = [aws_security_group.privatelink]
}

resource "aws_vpc_endpoint" "ecr" {
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.eu-west-1.ecr.dkr"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = "true"

  subnet_ids = aws_subnet.private.*.id

  security_group_ids = [
    "${aws_security_group.privatelink.id}"
  ]
  tags = merge(tomap({
    "name"        = "${var.project}-${var.environment}-${local.main_resource_name}-ecr-endpoint",
    "owner"       = local.owner,
    "environment" = var.environment,
    "project"     = var.project
  }), var.default_tags)

  depends_on = [aws_security_group.privatelink]
}

resource "aws_vpc_endpoint_route_table_association" "private_dynamo" {
  count           = var.az_count
  vpc_endpoint_id = aws_vpc_endpoint.dynamodb.id
  route_table_id  = element(aws_route_table.private.*.id, count.index)
}


resource "aws_vpc_endpoint_route_table_association" "private_s3" {
  count           = var.az_count
  vpc_endpoint_id = aws_vpc_endpoint.s3.id
  route_table_id  = element(aws_route_table.private.*.id, count.index)
}


// - private networks route non-local traffic through the NAT gateway to VPC Endpoints
resource "aws_route_table" "private" {
  count  = var.az_count
  vpc_id = aws_vpc.main.id

  tags = merge(tomap({
    "name"        = "${var.project}-${var.environment}-${local.main_resource_name}-route-table",
    "owner"       = local.owner,
    "environment" = var.environment,
    "project"     = var.project
  }), var.default_tags)

}

#resource "aws_route" "private" {
#  route_table_id = aws_route_table.private.id
#  destination_cidr_block = "0.0.0.0/0"
#  nat_gateway_id = aws_egress_only_internet_gateway.eigw.id
#}

// - Explicitly associate the newly created route tables to the private subnets (so they don't default to the main route table)
resource "aws_route_table_association" "private" {
  count          = var.az_count
  subnet_id      = element(aws_subnet.private.*.id, count.index)
  route_table_id = element(aws_route_table.private.*.id, count.index)
}

resource "aws_egress_only_internet_gateway" "eigw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_route" "outgoing-ip4" { //ipv6 difficult to rename this component
  count                       = var.az_count
  route_table_id              = element(aws_route_table.private.*.id, count.index)
  destination_ipv6_cidr_block = "::/0"
  egress_only_gateway_id      = aws_egress_only_internet_gateway.eigw.id
}


//ipv4 route added manually as it was causing existence conflicts
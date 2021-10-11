// --------------------------------------------------------------------------------------------------------------------
// - RDS Server
// --------------------------------------------------------------------------------------------------------------------
module "rds" {
  source      = "./modules/rds"
  environment = var.environment
  project     = var.project
  aws_region  = var.aws_region

  db_sub_gr_name    = "mariadbrdssub_gr_name"
  identifier        = "mariadbrds"
  storage_type      = "gp2"
  allocated_storage = "80"
  db_engine         = "mariadb"
  engine_version    = "10.3"
  instance_class    = "db.t3.medium"
  db_username       = "${var.db_username}"
  db_password       = "${var.db_password}"

  //vpc variables
  vpc_id                  = var.vpc_id
  private_subnet_ids      = var.private_subnet_ids
  public_subnet_ids       = var.public_subnet_ids
  cidr_block = var.cidr_block
  ipv6_cidr_block = var.ipv6_cidr_block


}
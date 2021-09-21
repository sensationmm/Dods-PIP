// --------------------------------------------------------------------------------------------------------------------
// - RDS Server
// --------------------------------------------------------------------------------------------------------------------
module "rds" {
  source      = "./modules/rds"
  environment = var.environment
  project     = var.project
  aws_region  = var.aws_region

  db_sub_gr_name    = "mariadbrdssub_gr_name"
  sec_grp_rds       = "${module.sec_group_rds.sec_grp_rds}"
  identifier        = "mariadbrds"
  storage_type      = "gp2"
  allocated_storage = "80"
  db_engine         = "mariadb"
  engine_version    = "10.3"
  instance_class    = "db.t3.medium"
  db_username       = "${var.db_username}"
  db_password       = "${var.db_password}"


}
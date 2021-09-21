variable "availability_zone_names" {
  type    = list(string)
  default = ["eu-west-1a", "eu-west-1b"]
}

variable "aws_region" {
  description = "The AWS region (e.g. 'eu-west-2')"
  default     = "eu-west-1"
  type        = string
}

variable "az_count" {
  description = "Number of AZs to cover in a given region"
  default     = "2"
  type        = string
}

variable "environment" {
  description = "environment level"
  default     = "deployment"
  type        = string
}

variable "project" {
  description = "project name"
  default     = "pip"
  type        = string
}

variable "db_sub_gr_name" {
  description = "required database security group name"
  default    = "mariadbrdssub_gr_name"
  type       = string
}
variable "sec_grp_rds" {
  description = "required security group for rds"
  default    = ""
  type       = string
}
variable "identifier" {
  description = "required for rds db definition"
  default    = "mariadbrds"
  type       = string
}
variable "storage_type" {
  description = "required storage type for rds hard drive gp2 or iops"
  default    = "gp2"
  type       = string
}
variable "allocated_storage" {
  description = "hard drive size"
  default    = "50"
  type       = string
}
variable "db_engine" {
  description = "required db engine"
  default    = "mariadb"
  type       = string
}
variable "engine_version" {
  description = "required engine version"
  default    = "10.3"
  type       = string
}
variable "instance_class" {
  description = "typical instance size medium"
  default    = "db.t3.micro"
  type       = string
}
variable "db_username" {
  description = "master username"
  default    = ""
  type       = string
}
variable "db_password" {
  description = "master password"
  default    = ""
  type       = string
}
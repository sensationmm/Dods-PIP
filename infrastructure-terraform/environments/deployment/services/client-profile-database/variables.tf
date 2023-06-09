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

locals {
  account_id  = "390773179818"
  external_id = "EXTERNAL_ID"
}

variable "db_username" {
  description = "db master username"
  default     = "admin"
  type        = string
}

variable "db_password" {
  description = "db master password - provided as secret from CI"
  default     = ""
  type        = string
}

variable "vpc_id" {
  description = "vpc variable"
  default     = ""
}
variable "private_subnet_ids" {
  description = "vpc variable"
  default     = ""
}
variable "public_subnet_ids" {
  description = "vpc variable"
  default     = ""
}

variable "cidr_block" {
  description = "vpc cidr block"
  default     = "172.17.0.0/16"
}

variable "ipv6_cidr_block" {
  description = "vpc cidr block"
}
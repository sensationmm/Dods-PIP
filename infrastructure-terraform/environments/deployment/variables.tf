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
  description = "environment passed in"
  default     = "development"
}

variable "app_image" {}
variable "account_id" {}
variable "db_password" {}

locals {

}

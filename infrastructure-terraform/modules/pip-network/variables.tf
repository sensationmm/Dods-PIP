
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
}

variable "app_image" {
  description = "Docker image to run in the ECS cluster"
  default     = "390773179818.dkr.ecr.eu-west-1.amazonaws.com/dods-pip/frontend-dods-pip:639732e4f367758bb6eddb333fc5f620b4d80029"
}



variable "vpc_id" {
  description = "vpc variable"
  default = ""
}
variable "private_subnet_ids" {
  description = "vpc variable"
  default = ""
}
variable "public_subnet_ids" {
  description = "vpc variable"
  default = ""
}
// --------------------------------------------------------------------------------------------------------------------
// - Custom Fargate policy Variables
// --------------------------------------------------------------------------------------------------------------------

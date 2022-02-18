variable "aws_region" {
  description = "Region for the project"
  default     = "eu-west-1"
  type        = string
}

variable "environment" {
  description = "Environment for this deployment"
  default     = "test"
  type        = string
}

variable "project" {
  description = "Internal project name"
  default     = "pip"
  type        = string
}

variable "taxonomy_bucket" {
  description = "Bucket with content files"
  type        = string
}
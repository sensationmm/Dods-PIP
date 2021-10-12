locals {
  application_id = "pip"
  owner          = "michael.brown@somoglobal.com"
}

variable "environment" {
  description = "environment for stack"
  default     = "develop"
}

variable "project" {
  description = "project name"
  default     = "pip"
}

variable "default_tags" {
  type = map(any)
  default = {
    Version   = "1"
    ManagedBy = "terraform"
  }
}

// --------------------------------------------------------------------------------------------------------------------
// - Fargate Controls
// --------------------------------------------------------------------------------------------------------------------
variable "fargate_task_execution_role_name" {
  description = "fargate task execution role name"
  default     = "fargate-execution-role"
}

variable "fargate_auto_scale_role_name" {
  description = "fargate autoscale role name"
  default     = "fargate-autoscale-role"
}

variable "fargate_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = 256
}

variable "fargate_memory" {
  description = "Fargate instance memory to provision (in MiB)"
  default     = 1024
}

variable "app_image" {
  description = "Docker image to run in the ECS cluster"
  default     = "370648122295.dkr.ecr.eu-west-1.amazonaws.com/development-repository:latest"
}

variable "app_count" {
  description = "Number of builder nodes to run"
  default     = 1
}

variable "app_port" {
  description = "Port exposed by builder to redirect traffic to"
  default     = 80
}
variable "log_group_name" {
  default = "builder-app"
}

variable "minimum_container_count" {
  default = 1
}

variable "maximum_container_count" {
  default = 4
}


// --------------------------------------------------------------------------------------------------------------------
// - Fargate Environment Variables
// --------------------------------------------------------------------------------------------------------------------

variable "vpc_id" {
  description = "vpc for deployment"
  default     = "vpc-123"
}

variable "private_subnet_ids" {
  description = "subnet for ECS"
  type        = list(string)
  default     = ["subnet123", "subnet123"]
}

variable "public_subnet_ids" {
  description = "subnet for Loadbalancer"
  type        = list(string)
  default     = ["subnet123", "subnet123"]
}

variable "aws_region" {
  description = "The AWS region things are created in"
  default     = "eu-west-1"
}

variable "availability_zone_names" {
  type    = list(string)
  default = ["eu-west-1a", "eu-west-1b"]
}

variable "az_count" {
  description = "Number of AZs to cover in a given region"
  default     = 2
}

// --------------------------------------------------------------------------------------------------------------------
// - Custom Fargate policy Variables
// --------------------------------------------------------------------------------------------------------------------


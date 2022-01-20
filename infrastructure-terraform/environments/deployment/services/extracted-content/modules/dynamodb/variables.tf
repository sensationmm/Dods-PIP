variable "environment" {
  description = "environment level"
  default     = "deployment"
  type        = string
}

variable "name" {
  description = "project name"
  default     = "project"
  type        = string
}

variable "partition-key" {
  description = "partition key"
  default     = "id"
  type        = string
}
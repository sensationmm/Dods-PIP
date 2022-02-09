variable "environment" {
  description = "environment for stack"
  default     = "development"
}

variable "project" {
  description = "project name"
  default     = "pip"
}

variable "queue_name" {
  default = "queue-1"
}

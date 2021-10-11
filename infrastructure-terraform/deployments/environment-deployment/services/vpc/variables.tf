variable "environment" {
  description = "environment level"
  default     = "deployment"
  type        = string
}

variable "az_count" {
  description = "number of availability zones"
  default     = 2
}
// --------------------------------------------------------------------------------------------------------------------
// - Tagging defaults for this module
// --------------------------------------------------------------------------------------------------------------------
locals {
  application_id = "website-builder"
  owner          = "michael.brown@somoglobal.com"
}

variable "default_tags" {
  type = map(any)
  default = {
    Version   = "1"
    ManagedBy = "terraform"
  }
}
variable "project" {
  description = "project name for this service module"
  default     = "components"
}

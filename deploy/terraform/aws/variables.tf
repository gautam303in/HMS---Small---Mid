variable "aws_region" {
  description = "AWS deployment region"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Target deployment environment (dev, uat, prod)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "System project identifier"
  type        = string
  default     = "grand-azure-hms"
}

variable "db_password" {
  description = "PostgreSQL RDS Master Password"
  type        = string
  sensitive   = true
  default     = "AzureSecure2026!Pms"
}

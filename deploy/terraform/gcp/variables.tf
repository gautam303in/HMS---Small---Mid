variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "grand-azure-hospitality"
}

variable "region" {
  description = "GCP primary region"
  type        = string
  default     = "asia-south1"
}

variable "environment" {
  description = "Target deployment environment (dev, uat, prod)"
  type        = string
  default     = "prod"
}

variable "db_password" {
  description = "Cloud SQL PostgreSQL root password"
  type        = string
  sensitive   = true
  default     = "AzureSecureGcp2026!Pms"
}

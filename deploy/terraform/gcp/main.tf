terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# 1. Cloud Storage Bucket for KYC Documents
resource "google_storage_bucket" "kyc_vault" {
  name          = "${var.project_id}-kyc-vault-${var.environment}"
  location      = var.region
  force_destroy = false

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }
}

# 2. Cloud SQL PostgreSQL 16 HA Instance
resource "google_sql_database_instance" "postgres" {
  name             = "hms-postgres-${var.environment}"
  database_version = "POSTGRES_16"
  region           = var.region

  settings {
    tier              = "db-custom-2-7680"
    availability_type = "REGIONAL" # High Availability Multi-Zone

    backup_configuration {
      enabled    = true
      start_time = "02:00"
    }

    ip_configuration {
      ipv4_enabled = true
    }

    database_flags {
      name  = "cloudsql.enable_pgaudit"
      value = "on"
    }
  }

  deletion_protection = false
}

resource "google_sql_database" "database" {
  name     = "grand_azure_hms"
  instance = google_sql_database_instance.postgres.name
}

resource "google_sql_user" "db_user" {
  name     = "hms_admin"
  instance = google_sql_database_instance.postgres.name
  password = var.db_password
}

# 3. Memorystore for Redis Instance
resource "google_redis_instance" "cache" {
  name           = "hms-redis-${var.environment}"
  tier           = "STANDARD_HA"
  memory_size_gb = 1
  region         = var.region
  redis_version  = "REDIS_7_0"

  display_name = "HMS Availability Cache & Rate Limiting"
}

# 4. Cloud Run Service for Backend API
resource "google_cloud_run_v2_service" "api_service" {
  name     = "hms-backend-${var.environment}"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "gcr.io/${var.project_id}/hms-backend:latest"
      ports {
        container_port = 5000
      }
      env {
        name  = "PORT"
        value = "5000"
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }
      resources {
        limits = {
          cpu    = "2"
          memory = "2Gi"
        }
      }
    }
  }
}

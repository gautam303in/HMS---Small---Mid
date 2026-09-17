output "cloud_sql_connection_name" {
  description = "Cloud SQL connection name"
  value       = google_sql_database_instance.postgres.connection_name
}

output "cloud_sql_ip" {
  description = "Cloud SQL public IP"
  value       = google_sql_database_instance.postgres.public_ip_address
}

output "redis_host" {
  description = "Memorystore Redis primary host"
  value       = google_redis_instance.cache.host
}

output "kyc_bucket_name" {
  description = "Cloud Storage bucket for KYC documents"
  value       = google_storage_bucket.kyc_vault.name
}

output "cloud_run_url" {
  description = "Cloud Run service URI"
  value       = google_cloud_run_v2_service.api_service.uri
}

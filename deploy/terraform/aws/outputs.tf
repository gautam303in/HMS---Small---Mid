output "vpc_id" {
  description = "ID of the AWS VPC"
  value       = aws_vpc.main.id
}

output "database_endpoint" {
  description = "PostgreSQL RDS connection endpoint"
  value       = aws_db_instance.postgres.endpoint
}

output "redis_endpoint" {
  description = "ElastiCache Redis primary address"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "kyc_s3_bucket" {
  description = "S3 bucket for encrypted KYC documents"
  value       = aws_s3_bucket.kyc_storage.bucket
}

output "ecs_cluster_name" {
  description = "Name of the ECS Fargate cluster"
  value       = aws_ecs_cluster.hms_cluster.name
}

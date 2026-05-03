output "alb_logs_bucket_name" {
  value = aws_s3_bucket.alb_logs.bucket
}

output "alb_logs_policy_id" {
  value = aws_s3_bucket_policy.alb_logs.id
}
variable "vpc_id" {
  type = string
}

variable "public_subnets" {
  type = list(string)
}

variable "instance_id" {
  type = string
}

variable "logs_bucket" {
  type = string
}

variable "logs_bucket_policy_depends_on" {
  type = any
}
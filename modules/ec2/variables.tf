variable "vpc_id" {}
variable "subnet_id" {}

variable "ami" {}
variable "instance_type" {}
variable "key_name" {}

variable "alb_sg" {}
variable "db_host" {}
variable "db_user" {}
variable "db_password" {}
variable "db_name" {}
variable "db_port" {
  default = 5432
}
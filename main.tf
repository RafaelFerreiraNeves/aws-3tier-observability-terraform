module "vpc" {
  source = "./modules/vpc"
}


module "s3" {
  source = "./modules/s3"
}

module "ec2" {
  source = "./modules/ec2"

  ami           = var.ami
  instance_type = var.instance_type
  subnet_id     = module.vpc.public_subnets[0]
  key_name      = var.key_name
  vpc_id        = module.vpc.vpc_id

  db_host     = split(":", module.rds.endpoint)[0]
  db_user     = var.db_user
  db_password = var.db_password
  db_name     = var.db_name

  alb_sg = module.alb.alb_sg_id
}

module "rds" {
  source = "./modules/rds"

  db_name     = var.db_name
  db_user     = var.db_user
  db_password = var.db_password

  subnet_ids = module.vpc.private_subnets
  vpc_id     = module.vpc.vpc_id
  ec2_sg_id  = module.ec2.sg_id
}

data "aws_caller_identity" "current" {}

module "alb" {
  source = "./modules/alb"

  vpc_id         = module.vpc.vpc_id
  public_subnets = module.vpc.public_subnets
  instance_id    = module.ec2.instance_id

  logs_bucket = module.s3.alb_logs_bucket_name

  # 🔥 PASSA A DEPENDÊNCIA COMO VARIÁVEL
  logs_bucket_policy_depends_on = [
    module.s3.alb_logs_policy_id
  ]
}

output "alb_url" {
  value = "http://${module.alb.alb_dns}"
}

output "rds_endpoint" {
  value = module.rds.endpoint
}

module "lambda" {
  source = "./modules/lambda"

  bucket_name = module.s3.alb_logs_bucket_name
}
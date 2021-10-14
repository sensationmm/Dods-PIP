terraform {
  backend "s3" {
    encrypt        = true
    bucket         = "dods-pip-terraform-state"
    region         = "eu-west-1"
    dynamodb_table = "terraform-state-lock-dynamo"
    key            = "terraform.tfstate"
  }
  required_version = ">= 1.0.8"
}

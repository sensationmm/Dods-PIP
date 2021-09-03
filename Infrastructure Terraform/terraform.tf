terraform {
  backend "s3" {
    encrypt        = true
    bucket         = "mettr-websites2020-terraform-state"
    region         = "eu-west-1"
    dynamodb_table = "terraform-state-lock-dynamo"
    key            = "terraform.tfstate"
  }
  required_version = ">= 0.12"
}

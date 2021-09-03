provider "aws" {
  region = "eu-west-1"
}

provider "aws" {
  alias   = "dev"
  region  = "eu-west-1"
  profile = "deployment-1"
  assume_role {
    role_arn     = local.development_tf_role
    session_name = "DEVELOP"
    external_id  = local.external_id
  }
}

provider "aws" {
  alias   = "prod"
  region  = "eu-west-1"
  profile = "deployment-1"
  assume_role {
    role_arn     = local.production_tf_role
    session_name = "MASTER"
    external_id  = local.external_id
  }
}

provider "aws" {
  alias   = "staging"
  region  = "eu-west-1"
  profile = "deployment-1"
  assume_role {
    role_arn     = local.staging_tf_role
    session_name = "STAGING"
    external_id  = local.external_id
  }
}

provider "aws" {
  alias   = "dev-us-east-1"
  region  = "us-east-1"
  profile = "deployment-1"
  assume_role {
    role_arn     = local.development_tf_role
    session_name = "DEVELOP"
    external_id  = local.external_id
  }
}

provider "aws" {
  alias   = "prod-us-east-1"
  region  = "us-east-1"
  profile = "deployment-1"
  assume_role {
    role_arn     = local.production_tf_role
    session_name = "MASTER"
    external_id  = local.external_id
  }
}

provider "aws" {
  alias   = "staging-us-east-1"
  region  = "us-east-1"
  profile = "deployment-1"
  assume_role {
    role_arn     = local.staging_tf_role
    session_name = "STAGING"
    external_id  = local.external_id
  }
}

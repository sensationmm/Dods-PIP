provider "aws" {
  region  = "eu-west-1"
  profile = "dods-dev"
}

provider "aws" {
  alias   = "dev"
  region  = "eu-west-1"
  profile = "dods-dev"
  assume_role {
    role_arn     = local.development_tf_role
    session_name = "DEVELOP"
    external_id  = local.external_id
  }
}

provider "aws" {
  alias   = "prod"
  region  = "eu-west-1"
  profile = "dods-dev"
  assume_role {
    role_arn     = local.production_tf_role
    session_name = "MASTER"
    external_id  = local.external_id
  }
}

provider "aws" {
  alias   = "qa"
  region  = "eu-west-1"
  profile = "dods-dev"
  assume_role {
    role_arn     = local.qa_tf_role
    session_name = "QA"
    external_id  = local.external_id
  }
}

provider "aws" {
  alias   = "test"
  region  = "eu-west-1"
  profile = "dods-dev"
  assume_role {
    role_arn     = local.test_tf_role
    session_name = "TEST"
    external_id  = local.external_id
  }
}

provider "aws" {
  alias   = "dev-us-east-1"
  region  = "us-east-1"
  profile = "dods-dev"
  assume_role {
    role_arn     = local.development_tf_role
    session_name = "DEVELOP"
    external_id  = local.external_id
  }
}

provider "aws" {
  alias   = "prod-us-east-1"
  region  = "us-east-1"
  profile = "dods-dev"
  assume_role {
    role_arn     = local.production_tf_role
    session_name = "MASTER"
    external_id  = local.external_id
  }
}

provider "aws" {
  alias   = "staging-us-east-1"
  region  = "us-east-1"
  profile = "dods-dev"
  assume_role {
    role_arn     = local.qa_tf_role
    session_name = "QA"
    external_id  = local.external_id
  }
}

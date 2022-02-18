// --------------------------------------------------------------------------------------------------------------------
// - API Gateway for taxonomy trees out of S3 bucket
// --------------------------------------------------------------------------------------------------------------------
locals {
  main_resource_name = "taxonomy"
  bucket_to_read     = var.taxonomy_bucket
}

# Read-only access policy for buckets
resource "aws_iam_policy" "s3_policy" {
  name        = "s3-read-only"
  description = "Policy for allowing Read only on S3 buckets"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

# API Gateway Role
resource "aws_iam_role" "s3_api_gateway_role" {
  name = "s3-api-gateway-role"

  # Create Trust Policy for API Gateway
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
  EOF
}

# S3 Access Policy for the API Gateway Role
resource "aws_iam_role_policy_attachment" "s3_policy_attach" {
  role       = aws_iam_role.s3_api_gateway_role.name
  policy_arn = aws_iam_policy.s3_policy.arn
}

resource "aws_api_gateway_rest_api" "taxonomy" {
  name               = "${var.project}-${var.environment}-${local.main_resource_name}-api"
  description        = "API Gateway to serve taxonomy data from an S3 bucket"
  api_key_source     = "HEADER"
  binary_media_types = ["*/*"]
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_api_key" "taxonomy-client" {
  name        = "frontend"
  description = "API key meant to be used from the frontend"
}

resource "aws_api_gateway_resource" "taxonomy" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  parent_id   = aws_api_gateway_rest_api.taxonomy.root_resource_id
  path_part   = "taxonomy"
}


// { Endpoint for "Combined"
resource "aws_api_gateway_resource" "taxonomy-tree" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  parent_id   = aws_api_gateway_resource.taxonomy.id
  path_part   = "tree"
}

resource "aws_api_gateway_method" "get-all" {
  rest_api_id   = aws_api_gateway_rest_api.taxonomy.id
  resource_id   = aws_api_gateway_resource.taxonomy-tree.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get-s3-all" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-tree.id
  http_method = aws_api_gateway_method.get-all.http_method
  type        = "AWS"

  # Included because of this issue: https://github.com/hashicorp/terraform/issues/10501
  integration_http_method = "GET"

  # See uri description: https://docs.aws.amazon.com/apigateway/api-reference/resource/integration/
  uri         = "arn:aws:apigateway:${var.aws_region}:s3:path/${local.bucket_to_read}/Combined.json"
  credentials = aws_iam_role.s3_api_gateway_role.arn
}

resource "aws_api_gateway_method_response" "all-200" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-tree.id
  http_method = aws_api_gateway_method.get-all.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Content-Type"     = true
    "method.response.header.Content-Encoding" = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_method_response" "all-400" {
  depends_on = [aws_api_gateway_integration.get-s3-all]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-tree.id
  http_method = aws_api_gateway_method.get-all.http_method
  status_code = "400"
}

resource "aws_api_gateway_method_response" "all-500" {
  depends_on = [aws_api_gateway_integration.get-s3-all]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-tree.id
  http_method = aws_api_gateway_method.get-all.http_method
  status_code = "500"
}

resource "aws_api_gateway_integration_response" "all-200-integration-response" {
  depends_on = [aws_api_gateway_integration.get-s3-all]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-tree.id
  http_method = aws_api_gateway_method.get-all.http_method
  status_code = aws_api_gateway_method_response.all-200.status_code

  response_parameters = {
    "method.response.header.Content-Type"     = "integration.response.header.Content-Type"
    "method.response.header.Content-Encoding" = "integration.response.header.Content-Encoding"
  }
}

resource "aws_api_gateway_integration_response" "all-400-integration-response" {
  depends_on = [aws_api_gateway_integration.get-s3-all]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-tree.id
  http_method = aws_api_gateway_method.get-all.http_method
  status_code = aws_api_gateway_method_response.all-400.status_code

  selection_pattern = "4\\d{2}"
}

resource "aws_api_gateway_integration_response" "all-500-integration-response" {
  depends_on = [aws_api_gateway_integration.get-s3-all]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-tree.id
  http_method = aws_api_gateway_method.get-all.http_method
  status_code = aws_api_gateway_method_response.all-500.status_code

  selection_pattern = "5\\d{2}"
}
// end - "Combined" }


// { Endpoint for geography
resource "aws_api_gateway_resource" "taxonomy-geography" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  parent_id   = aws_api_gateway_resource.taxonomy.id
  path_part   = "geography"
}

resource "aws_api_gateway_resource" "taxonomy-geography-tree" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  parent_id   = aws_api_gateway_resource.taxonomy-geography.id
  path_part   = "tree"
}

resource "aws_api_gateway_method" "get-geography" {
  rest_api_id   = aws_api_gateway_rest_api.taxonomy.id
  resource_id   = aws_api_gateway_resource.taxonomy-geography-tree.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get-s3-geography" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-geography-tree.id
  http_method = aws_api_gateway_method.get-geography.http_method
  type        = "AWS"

  # Included because of this issue: https://github.com/hashicorp/terraform/issues/10501
  integration_http_method = "GET"

  # See uri description: https://docs.aws.amazon.com/apigateway/api-reference/resource/integration/
  uri         = "arn:aws:apigateway:${var.aws_region}:s3:path/${local.bucket_to_read}/Geography.json"
  credentials = aws_iam_role.s3_api_gateway_role.arn

}

resource "aws_api_gateway_method_response" "geography-200" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-geography-tree.id
  http_method = aws_api_gateway_method.get-geography.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Content-Type"     = true
    "method.response.header.Content-Encoding" = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_method_response" "geography-400" {
  depends_on = [aws_api_gateway_integration.get-s3-geography]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-geography-tree.id
  http_method = aws_api_gateway_method.get-geography.http_method
  status_code = "400"
}

resource "aws_api_gateway_method_response" "geography-500" {
  depends_on = [aws_api_gateway_integration.get-s3-geography]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-geography-tree.id
  http_method = aws_api_gateway_method.get-geography.http_method
  status_code = "500"
}

resource "aws_api_gateway_integration_response" "geography-200-integration-response" {
  depends_on = [aws_api_gateway_integration.get-s3-geography]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-geography-tree.id
  http_method = aws_api_gateway_method.get-geography.http_method
  status_code = aws_api_gateway_method_response.geography-200.status_code

  response_parameters = {
    "method.response.header.Content-Type"     = "integration.response.header.Content-Type"
    "method.response.header.Content-Encoding" = "integration.response.header.Content-Encoding"
  }
}

resource "aws_api_gateway_integration_response" "geography-400-integration-response" {
  depends_on = [aws_api_gateway_integration.get-s3-geography]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-geography-tree.id
  http_method = aws_api_gateway_method.get-geography.http_method
  status_code = aws_api_gateway_method_response.geography-400.status_code

  selection_pattern = "4\\d{2}"
}

resource "aws_api_gateway_integration_response" "geography-500-integration-response" {
  depends_on = [aws_api_gateway_integration.get-s3-geography]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-geography-tree.id
  http_method = aws_api_gateway_method.get-geography.http_method
  status_code = aws_api_gateway_method_response.geography-500.status_code

  selection_pattern = "5\\d{2}"
}
// end endpoint for Geography }

// { Endpoint for Organisations
resource "aws_api_gateway_resource" "taxonomy-organisations" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  parent_id   = aws_api_gateway_resource.taxonomy.id
  path_part   = "organisations"
}

resource "aws_api_gateway_resource" "taxonomy-organisations-tree" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  parent_id   = aws_api_gateway_resource.taxonomy-organisations.id
  path_part   = "tree"
}

resource "aws_api_gateway_method" "get-organisations" {
  rest_api_id   = aws_api_gateway_rest_api.taxonomy.id
  resource_id   = aws_api_gateway_resource.taxonomy-organisations-tree.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get-s3-organisations" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-organisations-tree.id
  http_method = aws_api_gateway_method.get-organisations.http_method
  type        = "AWS"

  # Included because of this issue: https://github.com/hashicorp/terraform/issues/10501
  integration_http_method = "GET"

  # See uri description: https://docs.aws.amazon.com/apigateway/api-reference/resource/integration/
  uri         = "arn:aws:apigateway:${var.aws_region}:s3:path/${local.bucket_to_read}/Organisations.json"
  credentials = aws_iam_role.s3_api_gateway_role.arn

}

resource "aws_api_gateway_method_response" "organisations-200" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-organisations-tree.id
  http_method = aws_api_gateway_method.get-organisations.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Content-Type"     = true
    "method.response.header.Content-Encoding" = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_method_response" "organisations-400" {
  depends_on = [aws_api_gateway_integration.get-s3-organisations]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-organisations-tree.id
  http_method = aws_api_gateway_method.get-organisations.http_method
  status_code = "400"
}

resource "aws_api_gateway_method_response" "organisations-500" {
  depends_on = [aws_api_gateway_integration.get-s3-organisations]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-organisations-tree.id
  http_method = aws_api_gateway_method.get-organisations.http_method
  status_code = "500"
}

resource "aws_api_gateway_integration_response" "organisations-200-integration-response" {
  depends_on = [aws_api_gateway_integration.get-s3-organisations]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-organisations-tree.id
  http_method = aws_api_gateway_method.get-organisations.http_method
  status_code = aws_api_gateway_method_response.organisations-200.status_code

  response_parameters = {
    "method.response.header.Content-Type"     = "integration.response.header.Content-Type"
    "method.response.header.Content-Encoding" = "integration.response.header.Content-Encoding"
  }
}

resource "aws_api_gateway_integration_response" "organisations-400-integration-response" {
  depends_on = [aws_api_gateway_integration.get-s3-organisations]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-organisations-tree.id
  http_method = aws_api_gateway_method.get-organisations.http_method
  status_code = aws_api_gateway_method_response.organisations-400.status_code

  selection_pattern = "4\\d{2}"
}

resource "aws_api_gateway_integration_response" "organisations-500-integration-response" {
  depends_on = [aws_api_gateway_integration.get-s3-organisations]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-organisations-tree.id
  http_method = aws_api_gateway_method.get-organisations.http_method
  status_code = aws_api_gateway_method_response.organisations-500.status_code

  selection_pattern = "5\\d{2}"
}
// end - organisations }

// { Endpoint for People
resource "aws_api_gateway_resource" "taxonomy-people" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  parent_id   = aws_api_gateway_resource.taxonomy.id
  path_part   = "people"
}

resource "aws_api_gateway_resource" "taxonomy-people-tree" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  parent_id   = aws_api_gateway_resource.taxonomy-people.id
  path_part   = "tree"
}

resource "aws_api_gateway_method" "get-people" {
  rest_api_id   = aws_api_gateway_rest_api.taxonomy.id
  resource_id   = aws_api_gateway_resource.taxonomy-people-tree.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get-s3-people" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-people-tree.id
  http_method = aws_api_gateway_method.get-people.http_method
  type        = "AWS"

  # Included because of this issue: https://github.com/hashicorp/terraform/issues/10501
  integration_http_method = "GET"

  # See uri description: https://docs.aws.amazon.com/apigateway/api-reference/resource/integration/
  uri         = "arn:aws:apigateway:${var.aws_region}:s3:path/${local.bucket_to_read}/People.json"
  credentials = aws_iam_role.s3_api_gateway_role.arn

}

resource "aws_api_gateway_method_response" "people-200" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-people-tree.id
  http_method = aws_api_gateway_method.get-people.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Content-Type"     = true
    "method.response.header.Content-Encoding" = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_method_response" "people-400" {
  depends_on = [aws_api_gateway_integration.get-s3-people]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-people-tree.id
  http_method = aws_api_gateway_method.get-people.http_method
  status_code = "400"
}

resource "aws_api_gateway_method_response" "people-500" {
  depends_on = [aws_api_gateway_integration.get-s3-people]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-people-tree.id
  http_method = aws_api_gateway_method.get-people.http_method
  status_code = "500"
}

resource "aws_api_gateway_integration_response" "people-200-integration-response" {
  depends_on = [aws_api_gateway_integration.get-s3-people]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-people-tree.id
  http_method = aws_api_gateway_method.get-people.http_method
  status_code = aws_api_gateway_method_response.people-200.status_code

  response_parameters = {
    "method.response.header.Content-Type"     = "integration.response.header.Content-Type"
    "method.response.header.Content-Encoding" = "integration.response.header.Content-Encoding"
  }
}

resource "aws_api_gateway_integration_response" "people-400-integration-response" {
  depends_on = [aws_api_gateway_integration.get-s3-people]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-people-tree.id
  http_method = aws_api_gateway_method.get-people.http_method
  status_code = aws_api_gateway_method_response.people-400.status_code

  selection_pattern = "4\\d{2}"
}

resource "aws_api_gateway_integration_response" "people-500-integration-response" {
  depends_on = [aws_api_gateway_integration.get-s3-people]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-people-tree.id
  http_method = aws_api_gateway_method.get-people.http_method
  status_code = aws_api_gateway_method_response.people-500.status_code

  selection_pattern = "5\\d{2}"
}
// end - People }

// { Endpoint for Topics
resource "aws_api_gateway_resource" "taxonomy-topics" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  parent_id   = aws_api_gateway_resource.taxonomy.id
  path_part   = "topics"
}

resource "aws_api_gateway_resource" "taxonomy-topics-tree" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  parent_id   = aws_api_gateway_resource.taxonomy-topics.id
  path_part   = "tree"
}

resource "aws_api_gateway_method" "get-topics" {
  rest_api_id   = aws_api_gateway_rest_api.taxonomy.id
  resource_id   = aws_api_gateway_resource.taxonomy-topics-tree.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get-s3-topics" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-topics-tree.id
  http_method = aws_api_gateway_method.get-topics.http_method
  type        = "AWS"

  # Included because of this issue: https://github.com/hashicorp/terraform/issues/10501
  integration_http_method = "GET"

  # See uri description: https://docs.aws.amazon.com/apigateway/api-reference/resource/integration/
  uri         = "arn:aws:apigateway:${var.aws_region}:s3:path/${local.bucket_to_read}/Topics.json"
  credentials = aws_iam_role.s3_api_gateway_role.arn

}

resource "aws_api_gateway_method_response" "topics-200" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-topics-tree.id
  http_method = aws_api_gateway_method.get-topics.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Content-Type"     = true
    "method.response.header.Content-Encoding" = true
  }

  response_models = {
    "application/json" = "Empty"
  }
}

resource "aws_api_gateway_method_response" "topics-400" {
  depends_on = [aws_api_gateway_integration.get-s3-topics]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-topics-tree.id
  http_method = aws_api_gateway_method.get-topics.http_method
  status_code = "400"
}

resource "aws_api_gateway_method_response" "topics-500" {
  depends_on = [aws_api_gateway_integration.get-s3-topics]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-topics-tree.id
  http_method = aws_api_gateway_method.get-topics.http_method
  status_code = "500"
}

resource "aws_api_gateway_integration_response" "topics-200-integration-response" {
  depends_on = [aws_api_gateway_integration.get-s3-topics]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-topics-tree.id
  http_method = aws_api_gateway_method.get-topics.http_method
  status_code = aws_api_gateway_method_response.topics-200.status_code

  response_parameters = {
    "method.response.header.Content-Type"     = "integration.response.header.Content-Type"
    "method.response.header.Content-Encoding" = "integration.response.header.Content-Encoding"
  }
}

resource "aws_api_gateway_integration_response" "topics-400-integration-response" {
  depends_on = [aws_api_gateway_integration.get-s3-topics]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-topics-tree.id
  http_method = aws_api_gateway_method.get-topics.http_method
  status_code = aws_api_gateway_method_response.topics-400.status_code

  selection_pattern = "4\\d{2}"
}

resource "aws_api_gateway_integration_response" "topics-500-integration-response" {
  depends_on = [aws_api_gateway_integration.get-s3-topics]

  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-topics-tree.id
  http_method = aws_api_gateway_method.get-topics.http_method
  status_code = aws_api_gateway_method_response.topics-500.status_code

  selection_pattern = "5\\d{2}"
}
// end - Topics }

resource "aws_api_gateway_deployment" "taxonomy-deployment" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.taxonomy,
      aws_api_gateway_integration.get-s3-all,
      aws_api_gateway_resource.taxonomy-geography-tree,
      aws_api_gateway_integration.get-s3-geography,
      aws_api_gateway_resource.taxonomy-organisations-tree,
      aws_api_gateway_integration.get-s3-organisations,
      aws_api_gateway_resource.taxonomy-people-tree,
      aws_api_gateway_integration.get-s3-people,
      aws_api_gateway_resource.taxonomy-topics-tree,
      aws_api_gateway_integration.get-s3-topics
      ]
    ))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "environment" {
  deployment_id = aws_api_gateway_deployment.taxonomy-deployment.id
  rest_api_id   = aws_api_gateway_rest_api.taxonomy.id
  stage_name    = var.environment
}

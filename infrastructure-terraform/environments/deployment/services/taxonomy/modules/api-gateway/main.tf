// --------------------------------------------------------------------------------------------------------------------
// - API Gateway
// --------------------------------------------------------------------------------------------------------------------
locals {
  main_resource_name = "taxonomy"
}

resource "aws_api_gateway_rest_api" "taxonomy" {
  name           = "${var.project}-${var.environment}-${local.main_resource_name}-api"
  description = "API Gateway to serve taxonomy data from an S3 bucket"
  api_key_source = "HEADER"
  binary_media_types = ["*/*"]
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}
resource "aws_api_gateway_api_key" "taxonomy-client" {
  name        = "frontend"
  description = "API key meant to be used from the frontend"
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

# S3 Access Policy to the API Gateway Role
resource "aws_iam_role_policy_attachment" "s3_policy_attach" {
  role       = aws_iam_role.s3_api_gateway_role.name
  policy_arn = aws_iam_policy.s3_policy.arn
}

resource "aws_api_gateway_rest_api_policy" "s3-read-only" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  policy      = <<EOF
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

resource "aws_api_gateway_resource" "taxonomy" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  parent_id   = aws_api_gateway_rest_api.taxonomy.root_resource_id
  path_part   = "taxonomy"
}

// Endpoint for geography
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

resource "aws_api_gateway_method" "geography-get" {
  rest_api_id   = aws_api_gateway_rest_api.taxonomy.id
  resource_id   = aws_api_gateway_resource.taxonomy-geography-tree.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "s3-object-read-geography" {
  rest_api_id = aws_api_gateway_rest_api.taxonomy.id
  resource_id = aws_api_gateway_resource.taxonomy-geography-tree.id
  http_method = aws_api_gateway_method.geography-get.http_method
  type        = "AWS"
}

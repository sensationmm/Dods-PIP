[
  {
    "name": "frontend-app",
    "image": "${app_image}",
    "cpu": ${fargate_cpu},
    "memory": ${fargate_memory},
    "networkMode": "awsvpc",
    "environment": [
        {"name": "ENVIRONMENT", "value": "${environment}"},
        {"name": "APP_API_URL", "value": "${api_gateway}"},
        {"name": "APP_TAXONOMY_URL", "value": "${api_taxonomy}"},
        {"name": "BACKEND_API_KEY", "value": "${fe_api_key}"},
        {"name": "NODE_ENV", "value": "${environment}"},
        {"name": "SECRET_COOKIE_PASSWORD", "value": "2gyZ3GDw3LHZQKDhPmPDL3sjREVRXPr8"},
  ],
  "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/builder-app",
          "awslogs-region": "${aws_region}",
          "awslogs-stream-prefix": "ecs"
        }
    },
    "portMappings": [
      {
        "containerPort": ${app_port},
        "hostPort": ${host_port}
      },
      {
        "containerPort": ${sentry_port},
        "hostPort": ${sentry_port}
      }
    ]
  }
]

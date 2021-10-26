[
  {
    "name": "frontend-app",
    "image": "${app_image}",
    "cpu": ${fargate_cpu},
    "memory": ${fargate_memory},
    "networkMode": "awsvpc",
    "environment": [
        {"name": "ENVIRONMENT", "value": "${environment}"},

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

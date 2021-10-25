[
  {
    "name": "frontend-app",
    "image": "${app_image}",
    "cpu": ${fargate_cpu},
    "memory": ${fargate_memory},
    "networkMode": "awsvpc",
    "environment": [
        {"name": "ENVIRONMENT", "value": "${environment}"},
        {"name": "SENTRY_DSN", "value": "${sentry_dsn}"},
        {"name": "STORAGE_BUCKET", "value": "${storage_bucket}"},
        {"name": "BUILD_TABLE_NAME", "value": "${job_table_name}"},
        {"name": "NODE_ENV", "value": "${node_env}"},
        {"name": "BUILD_JOB_QUEUE_URL", "value": "${build_queue_url}"}
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

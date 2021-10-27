// --------------------------------------------------------------------------------------------------------------------
// - Load Balancer
// --------------------------------------------------------------------------------------------------------------------
locals {
  main_resource_name = "fargate"

}
resource "aws_security_group" "lb" {
  name        = "${var.project}-${var.environment}-${local.main_resource_name}-alb-sg"
  description = "controls access to the ALB"
  vpc_id      = var.vpc_id

  ingress {
    protocol         = "tcp"
    from_port        = 80
    to_port          = 80
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    protocol         = "tcp"
    from_port        = 443
    to_port          = 443
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  egress {
    from_port        = var.app_port
    to_port          = var.app_port
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = merge(tomap({
    "name"        = "${var.project}-${var.environment}-${local.main_resource_name}-alb-sg",
    "owner"       = local.owner,
    "environment" = var.environment,
    "project"     = var.project
  }), var.default_tags)

}

resource "aws_security_group" "ecs_tasks" {
  name        = "${var.project}-${var.environment}-${local.main_resource_name}-tasks-sg"
  description = "allow inbound access from the ALB only - traffic to the ECS Cluster should only come from the ALB"
  vpc_id      = var.vpc_id

  ingress {
    protocol        = "tcp"
    from_port       = var.app_port
    to_port         = var.app_port
    security_groups = [aws_security_group.lb.id]
  }

  egress {
    protocol         = "tcp"
    from_port        = var.app_port
    to_port          = var.app_port
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  ingress {
    protocol        = "tcp"
    from_port       = 443
    to_port         = 443
    security_groups = [aws_security_group.lb.id]
  }

  egress {
    protocol         = "tcp"
    from_port        = 443
    to_port          = 443
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
  tags = merge(tomap({
    "name"        = "${var.project}-${var.environment}-${local.main_resource_name}-tasks-sg",
    "owner"       = local.owner,
    "environment" = var.environment,
    "project"     = var.project
  }), var.default_tags)

}

resource "aws_alb" "builder" {
  name            = "${var.project}-${var.environment}-${local.main_resource_name}-lb"
  subnets         = var.private_subnet_ids
  security_groups = [aws_security_group.lb.id]
  tags = merge(tomap({
    "name"        = "${var.project}-${var.environment}-${local.main_resource_name}-load-balancer",
    "owner"       = local.owner,
    "environment" = var.environment,
    "project"     = var.project
  }), var.default_tags)
}

resource "aws_alb_target_group" "app_target_group" {
  name        = "${var.project}-${var.environment}-${local.main_resource_name}-${substr(uuid(), 0, 3)}"
  port        = var.app_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    healthy_threshold   = "3"
    interval            = "120"
    protocol            = "HTTP"
    port                = "3000"
    matcher             = "200"
    timeout             = "3"
    path                = "/"
    unhealthy_threshold = "5"
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = merge(tomap({
    "name"        = "${var.project}-${var.environment}-${local.main_resource_name}-target-group",
    "owner"       = local.owner,
    "environment" = var.environment,
    "project"     = var.project
  }), var.default_tags)
}

resource "aws_alb_listener" "front_end" {
  load_balancer_arn = aws_alb.builder.id
  port              = 80
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.app_target_group.id
    type             = "forward"
  }
}

// --------------------------------------------------------------------------------------------------------------------
// - ECS Definition: Scaling
// --------------------------------------------------------------------------------------------------------------------
resource "aws_appautoscaling_target" "target" {
  service_namespace  = "ecs"
  resource_id        = "service/${aws_ecs_cluster.ecs_cluster.name}/${aws_ecs_service.frontend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  role_arn           = aws_iam_role.ecs_auto_scale_role.arn
  min_capacity       = var.minimum_container_count
  max_capacity       = var.maximum_container_count
}

# Automatically scale capacity up by one
resource "aws_appautoscaling_policy" "up" {
  name               = "${var.project}-${var.environment}-${local.main_resource_name}-scale-up"
  service_namespace  = "ecs"
  resource_id        = "service/${aws_ecs_cluster.ecs_cluster.name}/${aws_ecs_service.frontend.name}"
  scalable_dimension = "ecs:service:DesiredCount"

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 90
    metric_aggregation_type = "Maximum"

    step_adjustment {
      metric_interval_lower_bound = 0
      scaling_adjustment          = 1
    }
  }

  depends_on = [aws_appautoscaling_target.target]
}

# Automatically scale capacity down by one
resource "aws_appautoscaling_policy" "down" {
  name               = "${var.project}-${var.environment}-${local.main_resource_name}-scale-down"
  service_namespace  = "ecs"
  resource_id        = "service/${aws_ecs_cluster.ecs_cluster.name}/${aws_ecs_service.frontend.name}"
  scalable_dimension = "ecs:service:DesiredCount"

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 120
    metric_aggregation_type = "Maximum"

    step_adjustment {
      metric_interval_lower_bound = 0
      scaling_adjustment          = -1
    }
  }

  depends_on = [aws_appautoscaling_target.target]
}


variable "high_threshold" {
  default = 1
}
variable "low_threshold" {
  default = 0
}

resource "aws_ecr_repository" "frontend" {
  name = "pip/frontend"
}

data "aws_ecr_authorization_token" "token" {
  registry_id = aws_ecr_repository.frontend.registry_id
}

locals {
  ecr_secret = {
    username = data.aws_ecr_authorization_token.token.user_name
    password = data.aws_ecr_authorization_token.token.password
  }
}

resource "aws_secretsmanager_secret" "ecr" {
  name = "all/loginECR"
}

resource "aws_secretsmanager_secret_version" "ecr" {
  secret_id     = aws_secretsmanager_secret.ecr.id
  secret_string = jsonencode(local.ecr_secret)
}

resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${var.project}-${var.environment}-${local.main_resource_name}-cluster"
}

// --------------------------------------------------------------------------------------------------------------------
// - ECS Definition: app & task
// --------------------------------------------------------------------------------------------------------------------
data "template_file" "app" {
  template = file("${path.module}/templates/app.json.tpl")
  vars = {
    host_port      = var.app_port
    name           = local.main_resource_name
    app_image      = var.app_image
    app_port       = var.app_port
    fargate_cpu    = var.fargate_cpu
    fargate_memory = var.fargate_memory
    aws_region     = var.aws_region
    environment    = var.environment
    log_group_name = var.log_group_name
  }
}

resource "aws_ecs_task_definition" "app_task" {
  family                   = "${var.project}-${var.environment}-${local.main_resource_name}-task-definition"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  container_definitions    = data.template_file.app.rendered

  tags = merge(tomap({
    "name"        = "${var.project}-${var.environment}-${local.main_resource_name}-task-definition",
    "owner"       = local.owner,
    "environment" = var.environment,
    "project"     = var.project
  }), var.default_tags)
}

resource "aws_ecs_service" "frontend" {
  name            = "frontend-service"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.app_task.arn
  desired_count   = var.app_count
  launch_type     = "FARGATE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = var.private_subnet_ids
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.app_target_group.id
    container_name   = "frontend-app"
    container_port   = var.app_port
  }

  depends_on = [aws_alb_listener.front_end, aws_iam_role_policy_attachment.ecs_task_execution_role]
}

// --------------------------------------------------------------------------------------------------------------------
// - ECS Definition: Logs
// --------------------------------------------------------------------------------------------------------------------
#Set up CloudWatch group and log stream and retain logs for 30 days
resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/ecs/${var.log_group_name}"
  retention_in_days = 30

  tags = merge(tomap({
    "Name" = "${var.project}-${var.environment}-${local.main_resource_name}-log-group"
  }), var.default_tags)
}

resource "aws_cloudwatch_log_stream" "log_stream" {
  name           = "builder-log-stream"
  log_group_name = aws_cloudwatch_log_group.log_group.name
}

// --------------------------------------------------------------------------------------------------------------------
// - ECS Definition: Roles & Security
// --------------------------------------------------------------------------------------------------------------------

///
/// - Task execution Role
///
data "aws_iam_policy_document" "ecs_task_execution_role" {
  version = "2012-10-17"
  statement {
    sid     = ""
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "${var.project}-${var.environment}-${var.fargate_task_execution_role_name}"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution_role.json
}

resource "aws_iam_policy" "ecs_task_execution_role" {
  name        = "${var.project}-${var.environment}-${local.main_resource_name}-task-execution-policy"
  description = "Policy for trusted roles"
  policy      = file("${path.module}/templates/task-execution-role-access-policy.json.tpl")
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecs_task_execution_role.arn
}

///
/// - Task container Role
///
data "aws_iam_policy_document" "ecs_task_role" {
  version = "2012-10-17"
  statement {
    sid     = ""
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}
resource "aws_iam_role" "ecs_task_role" {
  name               = "${var.project}-${var.environment}-fargate-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_role.json
}

resource "aws_iam_policy" "ecs_task_role" {
  name        = "${var.project}-${var.environment}-${local.main_resource_name}-task-policy"
  description = "Policy for trusted roles"
  policy      = file("${path.module}/templates/task-access-policy.json.tpl")
}

resource "aws_iam_role_policy_attachment" "ecs_task_role" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.ecs_task_role.arn
}

data "aws_iam_policy_document" "ecs_auto_scale_role" {
  version = "2012-10-17"
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["application-autoscaling.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_auto_scale_role" {
  name               = "${var.project}-${var.environment}-${var.fargate_auto_scale_role_name}"
  assume_role_policy = data.aws_iam_policy_document.ecs_auto_scale_role.json

  tags = merge(tomap({
    "name"        = "${var.project}-${var.environment}-${var.fargate_auto_scale_role_name}",
    "owner"       = local.owner,
    "environment" = var.environment,
    "project"     = var.project
  }), var.default_tags)

}

resource "aws_iam_role_policy_attachment" "ecs_auto_scale_role" {
  role       = aws_iam_role.ecs_auto_scale_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceAutoscaleRole"
}

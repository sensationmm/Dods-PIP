output "alb_hostname" {
  value = "http://${aws_alb.builder.dns_name}"
}

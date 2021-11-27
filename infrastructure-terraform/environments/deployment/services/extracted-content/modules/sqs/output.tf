output "arn" {
  value = aws_sqs_queue.queue.arn
}

output "name" {
  value = aws_sqs_queue.queue.name
}

output "url" {
  value = aws_sqs_queue.queue.url
}

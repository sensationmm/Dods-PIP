output "vpc_id" {
  value = aws_vpc.main.id
}

output "private_subnet_ids" {
  value = aws_subnet.private.*.id
}

output "public_subnet_ids" {
  value = aws_subnet.public.*.id
}

output "availability_zone_names" {
  value = data.aws_availability_zones.available.names
}

output "az_count" {
  value = var.az_count
}

output "cidr_block" {
  value = aws_vpc.main.cidr_block
}

output "ipv6_cidr_block" {
  value = aws_vpc.main.ipv6_cidr_block
}
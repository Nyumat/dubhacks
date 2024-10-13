output "vpc_id" {
  value = aws_vpc.dubjam_vpc.id
}

output "instance_public_ip" {
  value = aws_instance.dubjam_instance.public_ip
}

output "elb_dns_name" {
  value = aws_elb.dubjam_elb.dns_name
}

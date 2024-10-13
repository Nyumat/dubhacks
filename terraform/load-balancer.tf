resource "aws_elb" "dubjam_elb" {
  availability_zones = ["us-west-2a"]
  
  listener {
    instance_port     = 80
    instance_protocol = "HTTP"
    lb_port           = 80
    lb_protocol       = "HTTP"
  }

  instances = [aws_instance.dubjam_instance.id]
  
  health_check {
    target              = "HTTP:80/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  tags = {
    Name = "DubJamELB"
  }
}

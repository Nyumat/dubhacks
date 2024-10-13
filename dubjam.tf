provider "aws" {
  region = "us-west-2"
}

resource "aws_vpc" "dubjam_vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.dubjam_vpc.id
}

resource "aws_subnet" "dubjam_subnet" {
  vpc_id     = aws_vpc.dubjam_vpc.id
  cidr_block = "10.0.1.0/24"
}

resource "aws_security_group" "dubjam_sg" {
  vpc_id = aws_vpc.dubjam_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "dubjam_instance" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.dubjam_subnet.id
  security_groups = [aws_security_group.dubjam_sg.name]
  
  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update
              sudo apt-get install -y nodejs npm
              git clone https://github.com/your-repo/dubjam.git
              cd dubjam
              npm install
              npm start
              EOF
  
  tags = {
    Name = "DubJamApp"
  }
}

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

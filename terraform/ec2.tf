resource "aws_instance" "dubjam_instance" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = vars.instance_type
  subnet_id     = aws_subnet.dubjam_subnet.id
  security_groups = [aws_security_group.dubjam_sg.name]
  
  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update
              sudo apt-get install -y nodejs npm
              git clone https://github.com/nyumat/dubhacks.git
              cd dubjam
              npm install
              npm start
              EOF
  
  tags = {
    Name = "DubJamApp"
  }
}

resource "aws_vpc" "dubjam_vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "dubjam_subnet" {
  vpc_id     = aws_vpc.dubjam_vpc.id
  cidr_block = "10.0.1.0/24"
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.dubjam_vpc.id
}

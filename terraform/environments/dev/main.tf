module "users" {
  source = "../../infra/users"
  environment = "${var.environment}"
  write_capacity = "1"
  read_capacity = "1"
  jwt_secret = "${var.jwt_secret}"
  admin_id = "${var.admin_id}"
  admin_email = "${var.admin_email}"
  admin_name = "${var.admin_name}"
  admin_password = "${var.admin_password}"
}

module "bookings" {
  source = "../../infra/bookings"
  environment = "${var.environment}"
  write_capacity = "1"
  read_capacity = "1"
}
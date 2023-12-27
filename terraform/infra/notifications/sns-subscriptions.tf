resource "aws_sns_topic_subscription" "email_subscription" {
  topic_arn = "${aws_sns_topic.notifications.arn}"
  protocol = "sqs"
  endpoint = "${aws_sqs_queue.email.arn}"
}

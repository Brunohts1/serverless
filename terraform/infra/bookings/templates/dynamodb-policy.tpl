{
  "Version": "2012-10-17",
  "Statement": [
      {
          "Action": [
          "${action}"
          ],
          "Effect"  : "Allow",
          "Resource": "${resource}"
      },
      {
          "Action": [
              "logs:CreateLogGroup",
              "logs:CreateLogStream",
              "logs:PutLogEvents"
          ],
          "Effect": "Allow",
          "Resource": "*"
      }
  ]
}       
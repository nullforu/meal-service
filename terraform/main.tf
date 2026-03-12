provider "aws" {
  region = var.region

  # backend "s3" { ...
  # if you want to use remote state
}

locals {
  lambda_zip_path = "${path.module}/build/lambda.zip"
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../dist"
  output_path = local.lambda_zip_path
}

resource "aws_iam_role" "lambda_role" {
  name = "${var.lambda_name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "lambda.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "meal_bot" {
  function_name = var.lambda_name
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs22.x"
  timeout       = var.lambda_timeout
  memory_size   = var.lambda_memory_size

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      NEIS_KEY          = var.neis_key
      BAND_ACCESS_TOKEN = var.band_access_token
      BAND_KEY          = var.band_key
    }
  }
}

resource "aws_iam_role" "scheduler_role" {
  name = "${var.lambda_name}-scheduler-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "scheduler.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "scheduler_invoke" {
  name = "${var.lambda_name}-scheduler-invoke"
  role = aws_iam_role.scheduler_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "lambda:InvokeFunction"
        Resource = aws_lambda_function.meal_bot.arn
      }
    ]
  })
}

resource "aws_scheduler_schedule" "meal_schedule" {
  name        = "${var.lambda_name}-daily-6am"
  description = "Run meal bot daily at 06:00"

  schedule_expression          = var.schedule_expression
  schedule_expression_timezone = var.schedule_timezone

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = aws_lambda_function.meal_bot.arn
    role_arn = aws_iam_role.scheduler_role.arn
  }
}

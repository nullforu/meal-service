output "lambda_arn" {
  value = aws_lambda_function.meal_bot.arn
}

output "schedule_name" {
  value = aws_scheduler_schedule.meal_schedule.name
}

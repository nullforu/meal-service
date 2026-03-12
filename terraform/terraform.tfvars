region         = "ap-northeast-2"
lambda_name    = "meal-band-bot"
lambda_timeout = 300 # 5 minutes
# 06:30 KST
schedule_expression = "cron(30 6 * * ? *)"
schedule_timezone   = "Asia/Seoul"

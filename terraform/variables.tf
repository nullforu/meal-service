variable "region" {
  type        = string
  description = "AWS region"
}

variable "lambda_name" {
  type        = string
  description = "Lambda function name"
}

variable "schedule_expression" {
  type        = string
  description = "EventBridge Scheduler cron expression"
}

variable "schedule_timezone" {
  type        = string
  description = "Scheduler timezone"
  default     = "Asia/Seoul"
}

variable "lambda_memory_size" {
  type        = number
  description = "Lambda memory in MB"
  default     = 128
}

variable "lambda_timeout" {
  type        = number
  description = "Lambda timeout in seconds"
  default     = 30
}

variable "neis_key" {
  type        = string
  description = "NEIS API key"
  default     = null
  sensitive   = true
}

variable "band_access_token" {
  type        = string
  description = "BAND API access token"
  default     = null
  sensitive   = true
}

variable "band_key" {
  type        = string
  description = "BAND key"
  default     = null
  sensitive   = true
}

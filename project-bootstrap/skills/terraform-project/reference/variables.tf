variable "app_name" {
  description = "The name of the application. Used as prefix for resource names."
  type        = string
}

variable "stage" {
  description = "Stage of the deployment (dev, qa, prd)"
  type        = string

  validation {
    condition     = contains(["local", "dev", "qa", "prd"], var.stage)
    error_message = "Currently supported stages are: 'local', 'dev', 'qa', and 'prd'."
  }
}

variable "aws_region" {
  description = "AWS region in which to deploy the Terraform resources."
  type        = string
}

variable "assume_role_arn" {
  description = "ARN of the IAM role to assume for resource provisioning."
  type        = string
}

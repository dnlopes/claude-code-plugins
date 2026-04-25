---
name: terraform-project
description: Canonical Terraform project reference for scaffolding-project — provides file structure, Makefile targets, and Renovate rules for AWS infrastructure with S3 backend.
---

# Terraform Project

Canonical reference for scaffolding a Terraform project within a repository. This skill is loaded by `scaffolding-project` — it is not invoked directly.

## Project Structure

A scaffolded Terraform project creates the following in the target subdirectory:

```
{{TF_DIR}}/
├── providers.tf      # AWS provider with assume_role pattern
├── versions.tf       # required_version and required_providers
├── variables.tf      # Common variables (app_name, stage, aws_region, assume_role_arn)
└── configs/
    └── dev.tfvars    # Empty tfvars file (user fills in values)
```

## User-Provided Variables

scaffolding-project asks the user for these values during the interactive flow:

| Variable | Placeholder | Example | Purpose |
|----------|------------|---------|---------|
| Subdirectory path | `{{TF_DIR}}` | `terraform` | Where the TF project lives |
| Terraform workspace | `{{TF_WORKSPACE}}` | `my-app-dev` | Default workspace name |
| AWS profile | `{{AWS_PROFILE}}` | `jumpbox-operator` | AWS CLI profile for local operations |

## Reference Files

| Reference | Purpose | Parameterized |
|-----------|---------|---------------|
| `reference/providers.tf` | AWS provider with assume_role | No (user customizes after creation) |
| `reference/versions.tf` | Terraform and provider version constraints | No (user adds providers as needed) |
| `reference/variables.tf` | Common input variables | No (user extends with project-specific vars) |
| `reference/makefile-targets.mk` | Makefile section with tf-lint, tf-plan, tf-apply, tf-lock-file | Yes: `{{TF_DIR}}`, `{{TF_WORKSPACE}}`, `{{AWS_PROFILE}}` |
| `reference/renovate-rules.json` | Renovate packageRules entry | Yes: `{{TF_DIR}}` |

## Makefile Integration

The Makefile targets are inserted as a new section in the root Makefile. The section includes:

**Variables** (inserted in the Project Variables section):
- `TF_DIR` — path to the terraform directory
- `TF_INPUTS_FILE` — path to the default tfvars file
- `TF_WORKSPACE` — default workspace name
- `AWS_PROFILE` — AWS CLI profile

**Public targets:**
- `tf-lint` — format and validate Terraform
- `tf-plan` — plan changes with the default tfvars
- `tf-apply` — apply changes with auto-approve
- `tf-lock-file` — generate provider lock file for multiple platforms

**Internal targets:**
- `.tf-init` — initialize Terraform
- `.tf-select-workspace` — select the configured workspace
- `.tf-create-workspace` — create workspace if it doesn't exist

**ready target:** If a `ready` target exists in the Makefile, add `tf-lint` as a dependency.

## Renovate Integration

A single `packageRules` entry is added to `renovate.json`, grouping all Terraform dependency updates (providers, modules) scoped to the project subdirectory via `matchFileNames`.

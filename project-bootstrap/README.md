# Project Bootstrap

Repository bootstrapping and project scaffolding plugin for Claude Code.

## Skills

| Skill | User-Invocable | Purpose |
|-------|---------------|---------|
| `bootstrapping-repository` | Yes | Set up repo-level files (.gitignore, trivy.yaml, renovate.json, etc.) |
| `scaffolding-project` | Yes | Add a project type (Terraform, Go, Python) to a repo |
| `terraform-project` | No | Terraform project conventions and reference files |
| `golang-project` | No | Go project conventions and reference files |
| `python-project` | No | Python project conventions and reference files |

## Usage

- `/bootstrapping-repository` — Bootstrap a new or existing repository with standard files
- `/scaffolding-project` — Add or upgrade a project type within a repository

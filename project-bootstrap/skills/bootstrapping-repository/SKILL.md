---
name: bootstrapping-repository
description: Sets up a new GitHub repository or brings an existing repo in line with standard tooling — creates .gitignore, .editorconfig, .releaserc.yaml, trivy.yaml, renovate.json, and a Makefile skeleton. Detects existing files and presents a diff-and-review workflow instead of overwriting.
---

# Bootstrap Repository

Set up repo-level files that are project-type agnostic. Works on both fresh and existing repositories — detects what's present and proposes only the delta.

## Critical Guidelines

- You MUST scan the repo root for existing files before proposing any changes.
- You MUST present a summary of all proposed changes and wait for user approval before applying.
- You MUST NOT overwrite existing files without showing the diff and getting explicit approval.
- You MUST NOT create project-type-specific content (that is scaffolding-project's job).

## Reference Files

This skill manages the following repo-level files. The canonical versions are in the `reference/` directory.

| Reference File | Target Path | Purpose |
|---------------|-------------|---------|
| `reference/gitignore` | `.gitignore` | Standard ignores for Terraform, Go, Python, IDE, misc |
| `reference/editorconfig` | `.editorconfig` | UTF-8, 2-space indent, LF line endings |
| `reference/releaserc.yaml` | `.releaserc.yaml` | Semantic release with Angular conventional commits |
| `reference/trivy.yaml` | `trivy.yaml` | Security scanning (vuln, secret, misconfig) |
| `reference/renovate-base.json` | `renovate.json` | Base Renovate config (project-specific rules added by scaffolding-project) |
| `reference/makefile-skeleton.mk` | `Makefile` | Minimal skeleton with SHELL, .SHELLFLAGS, help target |

To add a new repo-level file: add it to `reference/` and add a row to this table.

## Progress

Copy this checklist and track your progress:

```
- [ ] Step 1: Inventory repo root for existing files
- [ ] Step 2: Compare each file against references
- [ ] Step 3: Present categorized summary to user
- [ ] Step 4: Apply user-approved changes
```

## How to Use

### Step 1: Inventory Current State

Read the repo root directory listing. For each file in the reference table above, check if the target path exists in the repo.

### Step 2: Compare Each File

For each reference file, categorize the result:

- **Missing** — target path does not exist in the repo. Read the reference file content and prepare to propose creating it.
- **Up-to-date** — target path exists and content is functionally equivalent to the reference (same entries/settings, ignoring whitespace differences and line ordering for files like `.gitignore` where order doesn't matter). Report as up-to-date, no action needed.
- **Diverged** — target path exists but content differs from the reference in meaningful ways (different settings, missing entries, extra entries). Read both files, identify the differences, and flag them. Note which differences might be intentional customizations vs. drift from the standard.

### Step 3: Present Summary

Present a categorized summary to the user:

```
## Bootstrap Summary

### New (will be created)
- `.editorconfig` — editor formatting rules
- `trivy.yaml` — security scanning config

### Diverged (differences found)
- `.gitignore` — your version includes Hugo-specific ignores not in the reference.
  The reference includes Go/Python ignores your version is missing.
- `Makefile` — your version has additional targets beyond the skeleton.
  No action recommended (scaffolding-project manages project targets).

### Up-to-date
- `.releaserc.yaml` — matches reference
- `renovate.json` — matches reference base config
```

### Step 4: Apply Approved Changes

Wait for the user to indicate which changes to apply. Apply only what the user approves. For diverged files, apply only the specific changes the user accepts.

## Troubleshooting

- **Makefile already has project targets:** This is expected in existing repos. The skeleton is a starting point — scaffolding-project adds project-specific sections. During bootstrap, only propose the Makefile if none exists at all.
- **renovate.json has packageRules beyond the base:** This is expected if scaffolding-project has been run. Only compare the base config (extends, schedule, automergeStrategy). Project-specific packageRules are managed by scaffolding-project.
- **.gitignore has project-specific entries:** The reference .gitignore includes common ignores for all supported project types. If the repo has additional entries (e.g., Hugo-specific), those are custom and should be preserved.

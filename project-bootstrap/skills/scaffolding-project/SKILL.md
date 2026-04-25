---
name: scaffolding-project
description: Adds a new project type (Terraform, Go, Python) to an existing repository or upgrades an existing scaffolded project — asks project type and subdirectory, detects existing projects for upgrade workflow, edits Makefile and renovate.json additively.
---

# Scaffold Project

Interactive skill for adding a project type to a repository or upgrading an existing one. Acts as a router that delegates to type-specific skills for the actual file content.

## Critical Guidelines

- You MUST ask the user for project type and subdirectory before doing anything.
- You MUST check whether the target subdirectory already contains a project before scaffolding.
- You MUST present all proposed changes as a summary and wait for user approval.
- You MUST edit existing files (Makefile, renovate.json) additively — never replace them.
- You MUST read the type-specific skill's SKILL.md and its reference files before generating content.

## Available Project Types

| Type | Skill to Load | Description |
|------|--------------|-------------|
| Terraform | `terraform-project` | AWS infrastructure with assume_role pattern |
| Go | `golang-project` | Go program with cmd/pkg layout and mockery |
| Python | `python-project` | Python project with uv, pytest, and quality tooling |

## Progress

Copy this checklist and track your progress:

```
- [ ] Step 1: Ask user for project type
- [ ] Step 2: Ask user for subdirectory
- [ ] Step 3: Detect existing state (fresh vs upgrade)
- [ ] Step 4: Fresh scaffold — load skill, ask variables, prepare and present changes
- [ ] Step 5: Upgrade — inventory, compare, present upgrade report
- [ ] Step 6: Apply user-approved changes
```

## How to Use

### Step 1: Ask Project Type

Present the available project types and ask the user which one to scaffold:

> What type of project would you like to scaffold?
> 1. **Terraform** — AWS infrastructure with assume_role pattern
> 2. **Go** — Go program with cmd/pkg layout and mockery
> 3. **Python** — Python project with uv, pytest, and quality tooling

### Step 2: Ask Subdirectory

Ask where the project should live:

> What subdirectory should this project use? (e.g., `terraform`, `api`, `lambda-checker`, `src-python`)

### Step 3: Detect Existing State

Check if the target subdirectory exists and contains files.

- **Subdirectory does not exist or is empty:** Proceed to **Fresh Scaffold** (Step 4).
- **Subdirectory contains files:** Suggest the upgrade workflow:
  > I found an existing project at `./{{subdirectory}}`. Would you like to run the upgrade workflow to compare it against the current references?

  If the user agrees, proceed to **Upgrade Workflow** (Step 5). If not, ask for a different subdirectory.

  To determine the project type of an existing project, check for signature files:
  - `*.tf` files present → Terraform
  - `go.mod` present → Go
  - `pyproject.toml` present → Python

  If multiple signatures match or none match, ask the user to confirm the project type.

### Step 4: Fresh Scaffold

1. **Load the type-specific skill.** Read the SKILL.md for the selected project type from `skills/<type>-project/SKILL.md`. Read all reference files listed in that skill.

2. **Ask user-provided variables.** Each type skill documents the variables the user needs to provide. Ask for each one. Example for Terraform:
   > I need a few configuration values:
   > - **Terraform workspace name** (e.g., `my-app-dev`):
   > - **AWS CLI profile** (e.g., `jumpbox-operator`):

3. **Prepare changes.** For each deliverable, substitute placeholders in the reference content with user-provided values:

   **Subdirectory files:** Create each file listed in the type skill's project structure.

   **Makefile targets:** Read the existing Makefile. Insert the type's Makefile targets section. Specifics:
   - Add variables to the Project Variables section (after the existing variables, before the first section banner).
   - Add the targets section before the `Others` section.
   - Add `.PHONY` entries to the existing `.PHONY` line, or create one if it doesn't exist.
   - If a `ready` target exists, add the type's ready target as a dependency.
   - If a `local-dev` target exists, check the type skill for a local-dev integration. Go and Python define one; Terraform does not. Add only what the type skill specifies.

   **Renovate rules:** Read the existing `renovate.json`. Add the type's `packageRules` entry to the `packageRules` array.

4. **Present summary.** Show all files that will be created and all edits that will be made to existing files. Show the actual content/diffs.

5. **Apply approved changes.** Wait for user approval. Apply only what the user accepts.

### Step 5: Upgrade Workflow

1. **Load the type-specific skill.** Same as fresh scaffold — read SKILL.md and all reference files.

2. **Inventory current state.** Read:
   - All files in the project subdirectory.
   - The Makefile — identify which targets belong to this project type.
   - `renovate.json` — identify which `packageRules` entries relate to this project's path.

3. **Compare against references.** For each reference file and each Makefile target, categorize:

   - **New** — exists in references but not in the project. Show what would be added.
   - **Diverged** — exists in both but content differs. Show the diff. Flag whether the difference looks like an intentional customization (e.g., additional variables in variables.tf, extra Makefile flags) or drift from the standard (e.g., missing a new target).
   - **Up-to-date** — content matches the reference. Report as current.
   - **Extra** — exists in the project but not in references (e.g., custom .tf files, additional Makefile targets). Acknowledge as custom content. Do not propose modifications.

4. **Present the upgrade report:**

   ```
   ## Upgrade Report: Terraform at ./terraform

   ### New (missing from your project)
   - `tf-lock-file` Makefile target — generates provider lock file for multiple platforms

   ### Diverged (differences found)
   - `variables.tf` — your version has 3 additional variables (blog_domain, additional_alt_names, dns_assume_role_arn).
     These appear to be intentional project-specific additions. No action recommended.
   - `tf-plan` target — reference uses `-lock=false`, your version does not include this flag.

   ### Up-to-date
   - `providers.tf` — matches reference pattern
   - `versions.tf` — matches reference structure
   - Renovate terraform-dependencies rule — matches reference

   ### Extra (custom, not in references)
   - `backend.tf`, `s3.tf`, `cdn.tf`, `acm.tf`, `locals.tf`, `outputs.tf`, `google.tf` — project-specific resources. Not modified.
   ```

5. **User reviews.** The user selects which proposed changes to apply. Apply only approved changes.

## Makefile Editing Conventions

- Section banners use the pattern: `#### <Section Name> ####` padded with `#` to column 100.
- Public targets have `## help text` after the target name.
- Internal targets start with `.` and have no help text.
- Variables use `?=` for overridable defaults.
- The `help` target and `Others` section are always last.
- When adding a project type, the new section goes before the `Others` section.

## Handling Multiple Projects of the Same Type

If the user scaffolds a second project of the same type (e.g., two Terraform projects), the Makefile targets will conflict. Detect this by checking if the type's targets already exist in the Makefile.

When a conflict is detected, ask the user how to disambiguate:
> Terraform targets already exist in the Makefile (for `./terraform`). How should I name the new targets?
> - Option 1: Prefix with project name (e.g., `tf-plan-network`, `tf-apply-network`)
> - Option 2: Use a different prefix entirely (e.g., `infra-plan`, `infra-apply`)

Apply the user's naming choice when substituting the Makefile targets.

## Placeholder Substitution

Reference files use `{{PLACEHOLDER}}` syntax. Before writing any file, substitute all placeholders with user-provided values. Verify no `{{...}}` patterns remain in the output.

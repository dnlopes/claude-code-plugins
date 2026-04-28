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

Call the `AskUserQuestion` tool to present the available project types as selectable options:

- **question:** "What type of project would you like to scaffold?"
- **header:** "Project type"
- **options:**
  - "Terraform" — AWS infrastructure with assume_role pattern
  - "Go" — Go program with cmd/pkg layout and mockery
  - "Python" — Python project with uv, pytest, and quality tooling

The tool auto-adds an "Other" slot. If the user picks it (or dismisses), stop — only the three supported types are valid; do not infer or accept alternatives.

### Step 2: Ask Subdirectory

Ask where the project should live:

> What subdirectory should this project use? (e.g., `terraform`, `api`, `lambda-checker`, `src-python`)

### Step 3: Detect Existing State

Check if the target subdirectory exists and contains files.

- **Subdirectory does not exist or is empty:** Proceed to **Fresh Scaffold** (Step 4).
- **Subdirectory contains files:** Call the `AskUserQuestion` tool:

  - **question:** "I found an existing project at `./{{subdirectory}}`. How should I proceed?"
  - **header:** "Existing project"
  - **options:**
    - "Run upgrade workflow (Recommended)" — compare it against the current references and propose updates
    - "Pick a different subdirectory" — re-ask Step 2

  On option 1, proceed to **Upgrade Workflow** (Step 5). On option 2, return to Step 2. If the user dismisses or picks "Other", stop. Do not offer to scaffold fresh on top of a non-empty directory — overwriting an existing project is not a supported path.

  To determine the project type of an existing project, check for signature files:
  - `*.tf` files present → Terraform
  - `go.mod` present → Go
  - `pyproject.toml` present → Python

  If multiple signatures match or none match, call the `AskUserQuestion` tool to confirm:

  - **question:** "I couldn't determine the project type at `./{{subdirectory}}`. Which type is it?"
  - **header:** "Project type"
  - **options:**
    - "Terraform"
    - "Go"
    - "Python"

  If the user dismisses or picks "Other", stop.

### Step 4: Fresh Scaffold

1. **Load the type-specific skill.** Read the SKILL.md for the selected project type from `skills/<type>-project/SKILL.md`. Read all reference files listed in that skill.

2. **Ask user-provided variables.** Each type skill documents the variables the user needs to provide. For each variable, check whether the type skill marks it as **Derived default** — if so, compute the default from prior answers (typically `{{<TYPE>_DIR}}`) and present it as a pre-filled value the user can accept or override. Only ask free-text for variables without a derivable default.

   Example for Terraform (no derivable defaults — all must be asked):
   > I need a few configuration values:
   > - **Terraform workspace name** (e.g., `my-app-dev`):
   > - **AWS CLI profile** (e.g., `jumpbox-operator`):

   Example for Go with `{{GO_DIR}}` = `lambda-checker` (defaults derived and shown for confirmation):
   > I need a few configuration values:
   > - **Go module name** (e.g., `github.com/dnlopes/my-project`):
   > - **Makefile dir variable** [default: `LAMBDA_CHECKER_DIR`] — press enter to accept or type a different name:
   > - **Binary name** [default: `lambda-checker`] — press enter to accept or type a different name:

   Derivation rules:
   - `{{GO_DIR_VAR}}` / `{{PY_DIR_VAR}}`: `upper(basename(<TYPE>_DIR))` with `-` replaced by `_`, suffix `_DIR`. (e.g., `lambda-checker` → `LAMBDA_CHECKER_DIR`, `src-python` → `SRC_PYTHON_DIR`)
   - `{{GO_BINARY_NAME}}`: `basename(GO_DIR)`. (e.g., `lambda-checker` → `lambda-checker`)

3. **Prepare changes.** For each deliverable, substitute placeholders in the reference content with user-provided values:

   **Subdirectory files:** Create each file listed in the type skill's project structure.

   **Makefile targets:** Read the existing Makefile. If no Makefile exists, create one using the `reference/makefile-skeleton.mk` from the `bootstrapping-repository` skill as the starting point, then insert the type's targets. If a Makefile exists, insert the type's Makefile targets section. Specifics:
   - Add variables to the Project Variables section (after the existing variables, before the first section banner).
   - Add the targets section before the `Others` section.
   - Add `.PHONY` entries to the existing `.PHONY` line, or create one if it doesn't exist.
   - If a `ready` target exists, add the type's ready target as a dependency.
   - If a `local-dev` target exists, check the type skill for a local-dev integration. Go and Python define one; Terraform does not. Add only what the type skill specifies.

   **Renovate rules:** Read the existing `renovate.json`. If no `renovate.json` exists, create one using the `reference/renovate-base.json` from the `bootstrapping-repository` skill as the starting point. Add the type's `packageRules` entry to the `packageRules` array.

4. **Present summary.** Show all files that will be created and all edits that will be made to existing files. Show the actual content/diffs.

5. **Apply approved changes.** Call the `AskUserQuestion` tool:

   - **question:** "How should I proceed?"
   - **header:** "Apply changes"
   - **options:**
     - "Apply all (Recommended)" — create all listed files and apply all Makefile / renovate.json edits
     - "Project files only" — create the subdirectory files; skip the Makefile and renovate.json edits

   The tool auto-adds an "Other" slot — if the user picks it (e.g., to specify a different subset), follow up with a free-text question to collect the items they want applied (file paths or edit identifiers from the summary). If the user dismisses the prompt, treat that as cancel and make no changes.

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

5. **User reviews.** Call the `AskUserQuestion` tool:

   - **question:** "How should I proceed with the upgrade?"
   - **header:** "Apply upgrade"
   - **options:**
     - "Apply all (Recommended)" — apply every "New" and "Diverged" change in the report
     - "New items only" — add only the missing items; leave "Diverged" files untouched

   The tool auto-adds an "Other" slot — if the user picks it, follow up with a free-text question to collect specific items to apply from the report (file names, target names, or rule identifiers). If the user dismisses the prompt, treat that as cancel and make no changes. Never modify items in the **Extra** category.

## Makefile Editing Conventions

- Section banners use the pattern: `#### <Section Name> ####` padded with `#` to column 100.
- Public targets have `## help text` after the target name.
- Internal targets start with `.` and have no help text.
- Variables use `?=` for overridable defaults.
- The `help` target and `Others` section are always last.
- When adding a project type, the new section goes before the `Others` section.
- If the existing Makefile does not follow the banner/section pattern (e.g., no `#### ... ####` banners, no `Others` section), first show the current Makefile structure (list the existing top-level targets in order), then call the `AskUserQuestion` tool:

  - **question:** "The existing Makefile doesn't follow the standard banner/section pattern. Where should I insert the new targets?"
  - **header:** "Insertion point"
  - **options:**
    - "End of file (Recommended)" — append after the last target
    - "Before the first target" — insert above the existing target list
    - "After an existing target" — pick which target in a follow-up question

  If the user picks "After an existing target", call `AskUserQuestion` again with up to 4 of the most likely targets (e.g., the last 4 in the file) as options. The auto-"Other" slot lets the user type a different target name if none of the offered ones fit. If the user dismisses either prompt, leave the Makefile alone.

## Handling Multiple Projects of the Same Type

If the user scaffolds a second project of the same type (e.g., two Terraform projects), the Makefile targets will conflict. Detect this by checking if the type's targets already exist in the Makefile.

When a conflict is detected, call the `AskUserQuestion` tool:

- **question:** "Terraform targets already exist in the Makefile (for `./terraform`). How should I name the new targets?"
- **header:** "Naming conflict"
- **options:**
  - "Prefix with project name (Recommended)" — append the new project's basename (e.g., `tf-plan-network`, `tf-apply-network`)
  - "Use a different prefix" — specify a custom prefix in a follow-up question (e.g., `infra-` → `infra-plan`, `infra-apply`)

If the user picks "Use a different prefix", follow up with a free-text question for the prefix. The auto-"Other" slot lets the user describe a different naming scheme entirely. If the user dismisses the prompt, abort scaffolding. Apply the user's naming choice when substituting the Makefile targets.

## Placeholder Substitution

Reference files use `{{PLACEHOLDER}}` syntax. Before writing any file, substitute all placeholders with user-provided values. Verify no `{{...}}` patterns remain in the output.

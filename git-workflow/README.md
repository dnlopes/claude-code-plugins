# git-workflow

Git and GitHub workflow commands for commits and pull requests.

**Version:** 2.1.0

## Commands

| Command | Description |
|---------|-------------|
| `/git-workflow:commit` | Create git commits with user approval and no Claude attribution |
| `/git-workflow:create-pr` | Create a pull request with proper title, description, and user approval |

## Skills

| Skill | Triggered When |
|-------|----------------|
| `committing-work` | Creating git commits, staging changes, or writing commit messages |
| `creating-pull-requests` | Creating pull requests, writing PR titles, or preparing branches for review |

## Commit Format

Angular conventional commit: `<type>(<scope>): <description>`

| Type | Purpose |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting (not CSS) |
| `refactor` | Code change without feature/fix |
| `perf` | Performance |
| `test` | Tests |
| `build` | Build/dependencies |
| `ci` | CI configuration |
| `chore` | Other |
| `revert` | Revert commit |

**Breaking changes:** Add `!` after type/scope (e.g., `feat!: remove deprecated API`)

## Workflows

### Committing Changes

1. Analyze changes with `git status` and `git diff`
2. Plan commit(s) - split if changes touch multiple concerns
3. Present plan to user for approval
4. Execute with `git add` (specific files, never `-A`) and commit

### Creating Pull Requests

1. Ensure all changes are committed
2. Draft PR title and body following Angular convention
3. Present draft to user for approval
4. Create PR with `gh pr create`

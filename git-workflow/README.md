# git-workflow

Git and GitHub workflow commands for commits and pull requests.

**Version:** 2.0.0

## Commands

| Command | Description |
|---------|-------------|
| `/git-workflow:commit` | Create git commits with user approval and no Claude attribution |

## Skills

| Skill | Activated When |
|-------|----------------|
| `committing-work` | Before committing changes |
| `creating-pull-requests` | Before creating pull requests |

## Workflows

### Committing Changes

1. Review conversation history and understand changes
2. Run `git status` and `git diff` to analyze modifications
3. Plan commit(s) - split if changes touch multiple concerns
4. Present plan to user for approval
5. Execute with `git add` (specific files, never `-A`) and commit

**Commit format:** Angular convention - `type(scope): description`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### Creating Pull Requests

- PR titles follow the same Angular convention as commits
- Use `gh pr create` for GitHub integration
- Breaking changes: add `!` after type/scope (e.g., `feat!: remove deprecated API`)

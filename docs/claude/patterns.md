---
scope:
  paths:
    - "*/commands/commit.md"
    - "*/agents/codebase-locator.md"
    - "*/skills/committing-work/SKILL.md"
    - docs-manager/skills/documentation-standards/reference/frontmatter-spec.md
    - macos-notifications/hooks/hooks.json
    - mcp-serena/.mcp.json
    - mcp-context7/.mcp.json
  summary: "Plugin configuration patterns, file structure conventions, and common implementation approaches"
last_review_date: 2025-12-03T00:28:11Z
last_updated: 2025-12-03T00:28:11Z
---

# Patterns

## Project Structure

### Plugin Directory Structure
Each plugin follows a consistent organization:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # Required: Plugin metadata
├── README.md                # Required: User documentation
├── commands/                # Optional: Slash commands
│   └── *.md
├── agents/                  # Optional: Specialized agents
│   └── *.md
├── skills/                  # Optional: Reusable guidelines
│   └── skill-name/
│       ├── SKILL.md
│       └── reference/
├── hooks/                   # Optional: Event automation
│   └── hooks.json
└── .mcp.json               # Optional: MCP configuration
```

**Conventions:**
- `.claude-plugin/plugin.json` and `README.md` are mandatory
- Other directories are optional based on plugin functionality
- Plugins are grouped by category in repository root (dev-toolkit, mcp-*, etc.)

## Command Definition Pattern

Commands are markdown files with YAML front-matter providing step-by-step instructions.

**Example**: git-workflow/commands/commit.md

```markdown
---
name: commit
description: Create git commits with user approval
---

# Committing Work

## Overview
Core principle: Analyze changes → Plan commits → Execute.

## The Process

### Step 1: Think about what changed
1. Review conversation history
2. Run `git status`
3. Run `git diff`
4. Review recent commits for message style

### Step 2: Present commit plan
Draft a commit message following conventional commits format:
- Format: `<type>(<scope>): <description>`
- Focus on "why" not "what"

### Step 3: Get user approval
Present the plan and wait for approval.

### Step 4: Execute commit
```bash
git add <files>
git commit -m "$(cat <<'EOF'
feat: add user authentication
EOF
)"
```
```

**Key characteristics:**
- Front-matter specifies command name and description
- Natural language instructions with clear steps
- User approval checkpoints for destructive operations
- Concrete examples with actual commands

## Agent Definition Pattern

Agents are markdown files with front-matter specifying tools, model, and focused instructions.

**Example**: dev-toolkit/agents/codebase-locator.md

```markdown
---
name: codebase-locator
description: Locates files, directories, and components relevant to a feature or task
tools: Grep, Glob, LS
model: sonnet
---

# Codebase Locator Agent

You are a specialist at finding WHERE code lives in a codebase.

## Your Mission
Given a natural language prompt describing a feature or task, locate:
- Relevant files and directories
- Key components and modules
- Configuration files
- Related test files

## Search Strategy
1. Start with broad searches (Glob for patterns)
2. Narrow with content searches (Grep for keywords)
3. Verify with directory listings (LS)
4. Return structured results with file paths

## Output Format
Return a structured list:
- **Primary files**: Core implementation files
- **Related files**: Supporting files, configs, tests
- **Suggested starting point**: Where to begin exploration
```

**Key characteristics:**
- Front-matter lists allowed tools (Grep, Glob, Read, LS, etc.)
- Model specification (sonnet for speed, opus for complexity)
- Single, well-defined responsibility
- Clear instructions on task and output format

## Skill Definition Pattern

Skills are markdown files providing comprehensive guidelines and best practices.

**Example**: git-workflow/skills/committing-work/SKILL.md

```markdown
---
name: committing-work
description: Use this skill before committing changes on the repository
---

# Committing Work

## Key Principles
- **Atomic commits**: Each commit contains related changes
- **Conventional format**: `<type>(<scope>): <description>`
- **Descriptive messages**: Focus on why, not what

## Examples
```bash
feat(auth): add JWT token validation
fix(api): resolve race condition in cache
refactor(db): extract query builder to separate module
```

## Pre-commit Checklist
- [ ] Changes are atomic and related
- [ ] Commit message follows format
- [ ] No commented-out code
- [ ] No debug statements
```

**Key characteristics:**
- Comprehensive guidelines with principles
- Concrete examples illustrating patterns
- Reference materials in `reference/` subdirectory
- Checklists for validation

## MCP Configuration Pattern

### HTTP-based MCP Server

**Example**: mcp-context7/.mcp.json

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

**Usage**: For external services providing MCP APIs via HTTP endpoints.

### Command-based MCP Server

**Example**: mcp-serena/.mcp.json

```json
{
  "mcpServers": {
    "serena": {
      "command": "uvx",
      "args": [
        "--from",
        "git+https://github.com/oraios/serena@v0.1.4",
        "serena",
        "start-mcp-server",
        "--port",
        "8089"
      ]
    }
  }
}
```

**Usage**: For locally-executed MCP servers that require installation and startup.

**Key characteristics:**
- Single `mcpServers` object with named server configurations
- HTTP servers: `type` and `url` fields
- Command servers: `command` and `args` array
- Auto-activated when plugin installed

## Hook Configuration Pattern

**Example**: macos-notifications/hooks/hooks.json

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Task complete\" with title \"Claude Code\" sound name \"Purr\"'"
          }
        ]
      }
    ],
    "Start": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Session started\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

**Key characteristics:**
- Top-level keys are Claude Code lifecycle events (`Start`, `Stop`, etc.)
- Each event has array of hook configurations
- `matcher` field filters when hook fires (empty string = always)
- `type: "command"` executes shell command
- Uses system tools (`osascript` for macOS notifications)

## Front-matter Pattern

Documentation files include YAML front-matter with scope, timestamps, and metadata.

**Example**: architecture.md front-matter

```yaml
---
scope:
  paths:
    - .claude-plugin/**
    - "*/README.md"
    - "*/commands/**"
    - "*/agents/**"
  summary: "Plugin system architecture and component relationships"
last_review_date: 2025-12-03T00:28:11Z
last_updated: 2025-12-03T00:28:11Z
---
```

**Key characteristics:**
- `scope.paths`: Glob patterns covering relevant files
- `scope.summary`: Brief description of document coverage
- `last_review_date`: When document was last validated
- `last_updated`: When document was last modified
- ISO 8601 timestamp format
- Used by docs-manager for staleness detection

## Naming Conventions

### Plugin Names
- **Format**: kebab-case
- **Examples**: `dev-toolkit`, `git-workflow`, `mcp-serena`, `macos-notifications`
- **Pattern**: Descriptive name indicating purpose, prefixed with category for clarity

### Command Names
- **Format**: kebab-case
- **Examples**: `create-plan`, `research-codebase`, `review-pr`, `commit`
- **Invocation**: `/plugin-name:command-name`

### Agent Names
- **Format**: kebab-case
- **Examples**: `codebase-locator`, `security-auditor`, `bug-hunter`, `principle-validator`
- **Pattern**: Role-based names indicating agent's specialty

### Skill Names
- **Format**: kebab-case
- **Examples**: `committing-work`, `golang-dev-guidelines`, `documentation-standards`
- **Pattern**: Descriptive names for knowledge domains

### File Naming
- **Commands**: `command-name.md` in `commands/` directory
- **Agents**: `agent-name.md` in `agents/` directory
- **Skills**: `SKILL.md` in `skills/skill-name/` directory
- **Documentation**: `architecture.md`, `domain.md`, `patterns.md`, etc. in `docs/claude/`

## Commit Message Pattern

All commits use conventional commit format following the Angular convention.

**Format**: `<type>(<scope>): <description>`

**Examples**:
```
feat(docs-manager): support completing partial onboarding
refactor(docs-manager): replace commit hash with timestamp for staleness tracking
fix(git-workflow): resolve pre-commit hook bypass issue
docs: update README with installation instructions
test(reviewer-toolkit): add tests for security auditor
```

**Common Types**:
- `feat` - New features
- `fix` - Bug fixes
- `refactor` - Code refactoring
- `docs` - Documentation
- `test` - Tests
- `build` - Build system changes
- `ci` - CI configuration changes
- `chore` - Other changes

## Error Handling Pattern

Commands include explicit error handling and validation steps.

**Approach**:
1. Check preconditions before execution
2. Validate inputs early
3. Present plan before destructive operations
4. Include rollback instructions if applicable
5. Provide clear error messages with resolution steps

**Example**: git-workflow/commands/commit.md includes:
- Pre-flight check for git repository
- Validation of staged changes
- User approval before commit
- Failure handling for pre-commit hooks

## Testing Pattern

Reviewer-toolkit uses confidence/impact scoring to filter findings.

**Approach**:
```
Confidence levels: High (90%+), Medium (60-90%), Low (<60%)
Impact levels: Critical, High, Medium, Low

Thresholds:
- Low confidence + Low impact = Don't report
- Medium confidence + Medium impact = Report with caveat
- High confidence + Any impact = Always report
```

**Usage**: Reduces false positives in code review findings by requiring minimum confidence/impact scores.

## Parallel Agent Pattern

Commands spawn multiple agents concurrently for comprehensive analysis.

**Example**: reviewer-toolkit/commands/review-pr.md spawns 6 agents in parallel:
- security-auditor
- bug-hunter
- code-reviewer
- contracts-reviewer
- test-coverage-reviewer
- historical-context-reviewer

**Key characteristics:**
- Single message with multiple Task tool invocations
- Agents run independently and return results
- Results aggregated after all complete
- Faster than sequential agent execution

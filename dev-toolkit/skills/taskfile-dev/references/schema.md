# Taskfile Schema Reference (v3)

## Root Schema

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `version` | string | Required | Schema version ("3" or "3.x") |
| `output` | string/object | interleaved | Output mode: interleaved, group, prefixed |
| `method` | string | checksum | Up-to-date checking: checksum, timestamp, none |
| `includes` | map[string]Include | - | Include other Taskfiles |
| `vars` | map[string]Variable | - | Global variables |
| `env` | map[string]Variable | - | Global environment variables |
| `tasks` | map[string]Task | - | Task definitions |
| `silent` | bool | false | Suppress command echoing globally |
| `dotenv` | []string | - | Load .env files |
| `run` | string | always | Execution mode: always, once, when_changed |
| `interval` | string | 100ms | Watch interval (e.g., "500ms", "2s") |
| `set` | []string | - | POSIX shell options |
| `shopt` | []string | - | Bash shell options |

## Task Schema

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `cmds` | []Command | - | Commands to execute (in sequence) |
| `cmd` | string | - | Single command (shorthand for cmds with one item) |
| `deps` | []Dependency | - | Dependencies to run first (parallel by default) |
| `desc` | string | - | Short description for `task --list` |
| `summary` | string | - | Long description for `task --summary` |
| `aliases` | []string | - | Alternative task names |
| `sources` | []string | - | Source files for fingerprinting |
| `generates` | []string | - | Generated files for fingerprinting |
| `status` | []string | - | Commands to check if task should run (skip if all exit 0) |
| `preconditions` | []Precondition | - | Conditions that must pass before running |
| `dir` | string | - | Working directory for task |
| `vars` | map[string]Variable | - | Task-local variables |
| `env` | map[string]Variable | - | Task-local environment variables |
| `dotenv` | []string | - | Task-specific .env files |
| `silent` | bool | false | Suppress command echoing |
| `interactive` | bool | false | Optimize for interactive CLI apps |
| `internal` | bool | false | Hide from `task --list` |
| `platforms` | []string | - | Restrict to platforms (linux, darwin, windows, etc.) |
| `requires` | Requires | - | Required variables |
| `prompt` | string/[]string | - | Confirmation prompt before running |
| `watch` | bool | false | Enable watch mode by default |
| `run` | string | - | Override global run mode |
| `method` | string | - | Override global method |
| `set` | []string | - | POSIX shell options |
| `shopt` | []string | - | Bash shell options |
| `ignore_error` | bool | false | Continue on command failure |
| `label` | string | - | Custom label for output |

## Command Types

### String Command
```yaml
cmds:
  - echo "Hello"
```

### Object Command
```yaml
cmds:
  - cmd: echo "Hello"
    silent: true
    ignore_error: true
    platforms: [linux]
```

### Task Reference
```yaml
cmds:
  - task: other-task
    vars:
      FOO: bar
```

### Deferred Command
```yaml
cmds:
  - defer: rm -f temp.txt
  - defer:
      task: cleanup
```

### Loop Command
```yaml
cmds:
  - for: [a, b, c]
    cmd: echo {{.ITEM}}
  - for: {var: ITEMS}
    cmd: process {{.ITEM}}
  - for:
      matrix:
        OS: [linux, darwin]
        ARCH: [amd64, arm64]
    cmd: build-{{.ITEM.OS}}-{{.ITEM.ARCH}}
```

## Variable Types

### Static Variable
```yaml
vars:
  NAME: value
  COUNT: 42
  ENABLED: true
  ITEMS: [a, b, c]
```

### Dynamic Variable (Shell)
```yaml
vars:
  VERSION:
    sh: git describe --tags
```

### Reference Variable
```yaml
vars:
  FULL_PATH:
    ref: .BUILD_DIR
```

### Map Variable
```yaml
vars:
  CONFIG:
    map:
      key1: value1
      key2: value2
# Access: {{.CONFIG.key1}}
```

## Include Schema

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `taskfile` | string | Required | Path to Taskfile or directory |
| `dir` | string | - | Working directory for included tasks |
| `optional` | bool | false | Don't error if missing |
| `flatten` | bool | false | Merge tasks without namespace |
| `internal` | bool | false | Hide all included tasks |
| `aliases` | []string | - | Namespace aliases |
| `excludes` | []string | - | Tasks to exclude |
| `vars` | map[string]Variable | - | Variables to pass |

### Include Examples
```yaml
includes:
  # Simple include
  docker: ./docker/Taskfile.yml

  # Full configuration
  api:
    taskfile: ./api/Taskfile.yml
    dir: ./api
    optional: true
    vars:
      ENV: production
```

## Precondition Schema

```yaml
preconditions:
  # Simple
  - sh: test -f config.yml
    msg: config.yml is required

  # With test alias
  - test: '[ -n "$API_KEY" ]'
    msg: API_KEY must be set
```

## Requires Schema

```yaml
requires:
  vars:
    - ENV
    - name: REGION
      enum: [us-east-1, us-west-2, eu-west-1]
```

## Output Configuration

### String Mode
```yaml
output: group  # interleaved | group | prefixed
```

### Object Mode (Grouped)
```yaml
output:
  group:
    begin: '::group::{{.TASK}}'
    end: '::endgroup::'
    error_only: false
```

## Shell Options

### POSIX Set Options
```yaml
set: [errexit, nounset, pipefail]
```

Available: `allexport`, `errexit`, `noglob`, `nounset`, `xtrace`, `pipefail`

### Bash Shopt Options
```yaml
shopt: [globstar, nullglob]
```

Available: `expand_aliases`, `globstar`, `nullglob`

## Dependency Schema

### Simple
```yaml
deps: [clean, lint]
```

### With Variables
```yaml
deps:
  - task: build
    vars:
      TARGET: debug
```

## Glob Patterns

### Sources/Generates
```yaml
sources:
  - '**/*.go'
  - exclude: '**/*_test.go'
generates:
  - bin/{{.TASK}}
```

## Platform Values

Combines Go's GOOS and GOARCH:
- OS: `linux`, `darwin`, `windows`, `freebsd`, etc.
- Arch: `amd64`, `arm64`, `386`, `arm`, etc.
- Combined: `linux/amd64`, `darwin/arm64`

```yaml
platforms: [linux, darwin/amd64, darwin/arm64]
```

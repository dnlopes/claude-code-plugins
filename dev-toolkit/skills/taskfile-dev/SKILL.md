---
name: taskfile-dev
description: Use when creating, modifying, reviewing, or improving Taskfiles (task runner YAML files), or when translating Makefiles to Taskfiles. Provides primitives, patterns, style conventions, and best practices for writing idiomatic Taskfiles.
user-invocable: false
---

# Taskfile Development

## Overview

Taskfile is a YAML-based task runner similar to Make. It defines tasks with commands, dependencies, variables, and conditional execution. Tasks are defined in `Taskfile.yml` (or `.yaml`, `.dist.yml` variants).

## When to Use

- **Creating Taskfiles**: New project needs build/dev automation
- **Adding tasks**: Extend existing Taskfile with new commands
- **Reviewing/improving**: Analyze and optimize existing Taskfiles
- **Translating**: Convert Makefiles to Taskfiles

## Style Conventions

| Convention | Example |
|------------|---------|
| 2-space indentation | Standard YAML |
| Uppercase variable names | `BUILD_DIR`, `VERSION` |
| Kebab-case task names | `build-docker`, `run-tests` |
| Colon for namespacing | `docker:build`, `test:unit` |
| No whitespace in templates | `{{.VAR}}` not `{{ .VAR }}` |

**Section order**: version, includes, output/silent/method/run, vars, env, tasks

## Core Primitives Quick Reference

| Primitive | Purpose | Example |
|-----------|---------|---------|
| `cmds` | Commands to run | `cmds: [go build, go test]` |
| `deps` | Run tasks first (parallel) | `deps: [clean, lint]` |
| `vars` | Task variables | `vars: {VERSION: v1.0}` |
| `env` | Environment variables | `env: {GO111MODULE: on}` |
| `dir` | Working directory | `dir: ./src` |
| `sources` | Input files (fingerprinting) | `sources: ['**/*.go']` |
| `generates` | Output files | `generates: [bin/app]` |
| `status` | Skip if commands succeed | `status: [test -f bin/app]` |
| `preconditions` | Fail if conditions unmet | `preconditions: [{sh: which go}]` |
| `internal` | Hide from `task --list` | `internal: true` |
| `desc` | Description for `--list` | `desc: Build the application` |
| `aliases` | Alternative names | `aliases: [b]` |
| `platforms` | OS/arch restrictions | `platforms: [linux, darwin]` |

## Task Patterns

### Simple Task
```yaml
tasks:
  build:
    desc: Build the application
    cmds:
      - go build -o bin/app ./cmd/app
```

### Task with Dependencies
```yaml
tasks:
  build:
    deps: [clean, generate]
    cmds:
      - go build -o bin/app
```

### Task with Variables
```yaml
tasks:
  build:
    vars:
      VERSION:
        sh: git describe --tags --always
    cmds:
      - go build -ldflags="-X main.Version={{.VERSION}}"
```

### Incremental Build (Skip if Up-to-date)
```yaml
tasks:
  build:
    sources:
      - '**/*.go'
      - go.mod
    generates:
      - bin/app
    cmds:
      - go build -o bin/app
```

### Task with Preconditions
```yaml
tasks:
  deploy:
    preconditions:
      - sh: '[ -n "$AWS_PROFILE" ]'
        msg: AWS_PROFILE must be set
    cmds:
      - aws s3 sync ./dist s3://bucket
```

### Looping Over Items
```yaml
tasks:
  lint:
    vars:
      PACKAGES: [./cmd/..., ./pkg/..., ./internal/...]
    cmds:
      - for: {var: PACKAGES}
        cmd: golangci-lint run {{.ITEM}}
```

### Namespaced Tasks via Includes
```yaml
includes:
  docker:
    taskfile: ./docker/Taskfile.yml
    dir: ./docker
# Usage: task docker:build
```

## Makefile to Taskfile Translation

| Makefile | Taskfile |
|----------|----------|
| `.PHONY: target` | Not needed (all tasks are "phony") |
| `target: dep1 dep2` | `deps: [dep1, dep2]` |
| `$(VAR)` | `{{.VAR}}` |
| `@command` (silent) | `silent: true` or prefix with `silent:` |
| `$@` (target name) | `{{.TASK}}` |
| `$<` (first prereq) | Use explicit variable or `sources` |
| `.DEFAULT_GOAL` | `default` task name |
| `include file.mk` | `includes: {name: {taskfile: file.yml}}` |

**Makefile example**:
```makefile
.PHONY: build clean

VERSION := $(shell git describe --tags)
BUILD_DIR := ./build

build: clean
	@echo "Building..."
	go build -ldflags="-X main.Version=$(VERSION)" -o $(BUILD_DIR)/app

clean:
	rm -rf $(BUILD_DIR)
```

**Equivalent Taskfile**:
```yaml
version: '3'

vars:
  VERSION:
    sh: git describe --tags
  BUILD_DIR: ./build

tasks:
  default:
    deps: [build]

  build:
    desc: Build the application
    deps: [clean]
    cmds:
      - echo "Building..."
      - go build -ldflags="-X main.Version={{.VERSION}}" -o {{.BUILD_DIR}}/app
    silent: true

  clean:
    desc: Clean build artifacts
    cmds:
      - rm -rf {{.BUILD_DIR}}
    internal: true
```

## Common Patterns by Use Case

### Development Workflow
```yaml
tasks:
  dev:
    desc: Run with hot reload
    watch: true
    sources: ['**/*.go']
    cmds:
      - go run ./cmd/app

  test:
    desc: Run tests
    cmds:
      - go test -v ./...

  lint:
    desc: Run linters
    cmds:
      - golangci-lint run
```

### Docker Workflow
```yaml
tasks:
  docker:build:
    desc: Build Docker image
    vars:
      TAG: '{{default "latest" .TAG}}'
    cmds:
      - docker build -t myapp:{{.TAG}} .

  docker:push:
    desc: Push to registry
    deps: [docker:build]
    cmds:
      - docker push myapp:{{.TAG}}
```

### CI/CD Pipeline
```yaml
tasks:
  ci:
    desc: Run CI pipeline
    cmds:
      - task: lint
      - task: test
      - task: build

  release:
    desc: Create release
    preconditions:
      - sh: git diff --quiet
        msg: Working directory must be clean
    cmds:
      - goreleaser release
```

## Best Practices

1. **Use `desc`** for all public tasks - enables discoverability via `task --list`
2. **Use `internal: true`** for helper tasks users shouldn't call directly
3. **Use fingerprinting** (`sources`/`generates`) to skip redundant work
4. **Use `preconditions`** with helpful error messages for required conditions
5. **Use namespaces** (colons or includes) to organize related tasks
6. **Prefer `deps`** over sequential `task:` calls for parallelism
7. **Use `.gitignore`** for `.task/` directory (checksum cache)
8. **Use `--dry`** flag when testing complex task changes
9. **Add `prompt`** for destructive operations

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Sequential deps | Use `deps:` (parallel) unless order matters |
| Hardcoded paths | Use variables: `{{.BUILD_DIR}}` |
| Missing descriptions | Add `desc:` for `task --list` |
| Rebuilding always | Add `sources:`/`generates:` for caching |
| Spaces in templates | Use `{{.VAR}}` not `{{ .VAR }}` |
| Complex inline scripts | Extract to shell script file |

## References

For detailed schema and templating reference, see:
- `references/schema.md` - Complete field documentation
- `references/templating.md` - Template functions and variables

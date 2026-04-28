---
name: golang-project
description: Canonical Go project reference for scaffolding-project — provides cmd/pkg directory structure, Makefile targets for build/test/lint, mockery integration, and Renovate rules.
---

# Golang Project

Canonical reference for scaffolding a Go project within a repository. This skill is loaded by `scaffolding-project` — it is not invoked directly.

## Project Structure

A scaffolded Go project creates the following in the target subdirectory:

```
{{GO_DIR}}/
├── cmd/
│   └── main.go       # Application entry point
├── pkg/               # Library packages (empty, user populates)
├── go.mod             # Module definition with testify and mockery
└── .mockery.yaml      # Mockery configuration for mock generation
```

After the initial `go mod tidy`, a `go.sum` file will be generated in the subdirectory. This is expected and should be committed to version control.

## User-Provided Variables

scaffolding-project asks the user for these values during the interactive flow. Variables marked **Derived default** are pre-filled from `{{GO_DIR}}`; the user can override but does not have to type a value.

| Variable | Placeholder | Example | Default | Purpose |
|----------|------------|---------|---------|---------|
| Subdirectory path | `{{GO_DIR}}` | `lambda-checker` | — (asked) | Where the Go project lives |
| Makefile variable name | `{{GO_DIR_VAR}}` | `LAMBDA_CHECKER_DIR` | **Derived:** `upper(basename(GO_DIR))` with `-` replaced by `_`, suffix `_DIR` | Makefile variable for the directory |
| Go module name | `{{GO_MODULE}}` | `github.com/dnlopes/my-project` | — (asked) | Module path in go.mod |
| Binary name | `{{GO_BINARY_NAME}}` | `lambda-checker` | **Derived:** `basename(GO_DIR)` | Output binary name for go build |

## Reference Files

| Reference | Purpose | Parameterized |
|-----------|---------|---------------|
| `reference/main.go` | Entry point skeleton | No |
| `reference/go.mod` | Module definition with testify | Yes: `{{GO_MODULE}}`. The `go` directive version should be updated to the latest stable Go release at scaffolding time. |
| `reference/.mockery.yaml` | Mockery config for mock generation | No |
| `reference/makefile-targets.mk` | Makefile section with go-build, go-unit-tests, go-ready, go-lint, go-mocks | Yes: `{{GO_DIR}}`, `{{GO_DIR_VAR}}`, `{{GO_BINARY_NAME}}` |
| `reference/renovate-rules.json` | Renovate packageRules entry | Yes: `{{GO_DIR}}` |

## Makefile Integration

The Makefile targets are inserted as a new section in the root Makefile. The section includes:

**Variables** (inserted in the Project Variables section):
- A variable for the Go directory path (name chosen by user, e.g., `LAMBDA_DIR`, `API_DIR`)
- `MOCKERY` — path to the mockery binary
- `GOLANGCI_LINT` — path to the golangci-lint binary

**Public targets:**
- `go-ready` — format, vet, lint, and tidy Go code
- `go-unit-tests` — run tests with coverage
- `go-mocks` — generate mocks with mockery
- `go-build` — build the Go binary
- `go-lint` — run golangci-lint

**Internal targets:**
- `.go-fmt` — format Go code
- `.go-vet` — run go vet

**ready target:** If a `ready` target exists in the Makefile, add `go-ready` as a dependency.

**local-dev target:** If a `local-dev` target exists, add mockery and golangci-lint installation using the `go-get-tool` macro. If the macro doesn't exist, add it to the Utils section.

## Tooling

| Tool | Purpose | Config Location |
|------|---------|----------------|
| go fmt | Code formatting | Built-in |
| go vet | Static analysis | Built-in |
| golangci-lint | Comprehensive linting (aggregates multiple linters) | `.golangci.yml` in project subdirectory (user creates) |
| mockery | Interface mock generation | `.mockery.yaml` in project subdirectory |
| testify | Test assertions and suites | `go.mod` dependency |

## go-get-tool Macro

If the Makefile does not already contain the `go-get-tool` macro, add it to the bottom:

```makefile
## Utils
define go-get-tool
@[ -f $(1) ] || { \
set -e ;\
TMP_DIR=$$(mktemp -d) ;\
cd $$TMP_DIR ;\
go mod init tmp ;\
echo "Downloading $(2)" ;\
GOBIN=${CURDIR}/bin go install $(2) ;\
rm -rf $$TMP_DIR ;\
}
endef
```

## Renovate Integration

A single `packageRules` entry is added to `renovate.json`, grouping Go dependency updates scoped to the project subdirectory via `matchFileNames`.

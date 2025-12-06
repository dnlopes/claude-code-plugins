# Development Examples

Good/bad examples for writing docs/development.md.

## Purpose

Development documentation helps developers set up their environment, build, test, and run the project. It's a practical guide for contributors.

**Audience:** Human developers (both new contributors and team members)

**Key principle:** This is human-focused documentation. Write clearly and practically, not for AI optimization.

---

## Required Sections

### Prerequisites (Required)

**Good Example:**
```markdown
## Prerequisites

- Go 1.21 or later
- PostgreSQL 15+
- Docker and Docker Compose (for local dependencies)
- Make (build automation)

### Optional
- [golangci-lint](https://golangci-lint.run/) - for local linting (CI runs this automatically)
- [air](https://github.com/cosmtrek/air) - for hot reload during development
```

**Why it's good:**
- Specific versions where they matter
- Links to installation for less common tools
- Separates required from optional

**Bad Example:**
```markdown
## Prerequisites

You need Go, a database, and some other tools installed.
```

**Why it's bad:**
- No versions
- Vague ("some other tools")
- Doesn't help someone set up their environment

---

### Setup (Required)

**Good Example:**
```markdown
## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/org/project.git
   cd project
   ```

2. Start local dependencies:
   ```bash
   docker-compose up -d
   ```
   This starts PostgreSQL and Redis.

3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if you need to customize database connection or API keys.

4. Run database migrations:
   ```bash
   make migrate
   ```

5. Verify setup:
   ```bash
   make test
   ```
   All tests should pass.
```

**Why it's good:**
- Step-by-step with actual commands
- Explains what each step does
- Includes verification step

**Bad Example:**
```markdown
## Setup

Clone the repo and run the setup script.
```

**Why it's bad:**
- No actual commands
- What setup script?
- No verification

---

### Build (Required)

**Good Example:**
```markdown
## Build

```bash
make build              # Build the main binary
make build-all          # Build all binaries (server, cli, worker)
make build-docker       # Build Docker image
```

The compiled binary is output to `./bin/server`.

### Build Flags
```bash
make build VERSION=1.2.3    # Set version number
make build DEBUG=1          # Include debug symbols
```
```

**Why it's good:**
- Uses Makefile (the project's build interface)
- Multiple build options documented
- Shows output location
- Documents build flags

**Bad Example:**
```markdown
## Build

```bash
go build -o bin/server -ldflags "-X main.version=1.0.0" ./cmd/server
```
```

**Why it's bad:**
- Raw command instead of build system interface
- Will break if build flags change
- Hard to remember

---

### Test (Required)

**Good Example:**
```markdown
## Test

```bash
make test               # Run all tests
make test-unit          # Run unit tests only
make test-integration   # Run integration tests (requires docker-compose up)
make test-coverage      # Run tests with coverage report
```

### Running Specific Tests
```bash
make test ARGS="-run TestUserService"           # Run tests matching pattern
make test ARGS="-v ./internal/service/..."      # Verbose output for package
```

### Test Requirements
- Integration tests require `docker-compose up -d` running
- Some tests need `TEST_DATABASE_URL` set (defaults to local postgres)
```

**Why it's good:**
- Multiple test commands for different scenarios
- Shows how to run specific tests
- Documents requirements

**Bad Example:**
```markdown
## Test

Run `go test ./...` to run all tests.
```

**Why it's bad:**
- Ignores Makefile
- No mention of test types
- Missing requirements

---

### Run Locally (Required)

**Good Example:**
```markdown
## Run Locally

### Development Mode (with hot reload)
```bash
make dev
```
Server starts at http://localhost:8080 with hot reload on file changes.

### Production Mode
```bash
make run
```
Or run the binary directly:
```bash
./bin/server
```

### With Docker
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Accessing the Application
- API: http://localhost:8080/api/v1
- Health check: http://localhost:8080/health
- Swagger docs: http://localhost:8080/docs (dev mode only)
```

**Why it's good:**
- Multiple ways to run (dev, prod, Docker)
- Shows useful URLs
- Mentions hot reload

---

## Optional Sections

### Environment Variables (Include when env vars are used)

**Good Example:**
```markdown
## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `REDIS_URL` | Yes | - | Redis connection string |
| `PORT` | No | `8080` | Server port |
| `LOG_LEVEL` | No | `info` | Logging level (debug, info, warn, error) |
| `STRIPE_SECRET_KEY` | Yes | - | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Yes | - | Stripe webhook signing secret |

### Getting API Keys

**Stripe:** Create a test account at https://dashboard.stripe.com/test/apikeys

Copy `.env.example` to `.env` and fill in the values. Never commit `.env` to git.
```

**Why it's good:**
- Table format is scannable
- Shows which are required
- Includes defaults
- Links to where to get API keys

**When to skip:** No environment variables used.

---

### Common Tasks (Include when helpful shortcuts exist)

**Good Example:**
```markdown
## Common Tasks

### Adding a Database Migration
```bash
make migration-create NAME=add_users_table
# Edit the generated file in migrations/
make migrate
```

### Regenerating API Clients
```bash
make generate-openapi     # Regenerate from OpenAPI spec
make generate-mocks       # Regenerate test mocks
```

### Debugging
```bash
make debug                # Start with debugger attached (Delve)
```

### Cleaning Up
```bash
make clean                # Remove build artifacts
docker-compose down -v    # Stop and remove containers/volumes
```
```

**Why it's good:**
- Documents common developer workflows
- Shows commands people actually need

**When to skip:** No common tasks beyond build/test/run.

---

### Deployment (Include when deployment process exists)

**Good Example:**
```markdown
## Deployment

### Staging
Merges to `main` automatically deploy to staging via GitHub Actions.

### Production
Production deployments are triggered manually:
1. Create a release tag: `git tag v1.2.3 && git push --tags`
2. GitHub Actions builds and pushes Docker image
3. ArgoCD detects new image and rolls out

### Rollback
```bash
# Via ArgoCD UI or:
argocd app rollback production --revision <previous-revision>
```
```

**Why it's good:**
- Documents the actual deployment process
- Includes rollback instructions
- Distinguishes staging from production

**When to skip:** No deployment process (library, local tool, etc.)

---

### Contributing (Include when repo accepts contributions)

**Good Example:**
```markdown
## Contributing

### Code Style
- Run `make lint` before committing - CI will fail on lint errors
- Run `make fmt` to auto-format code
- Follow existing patterns in the codebase

### Pull Request Process
1. Create a branch from `main`
2. Make your changes with tests
3. Ensure `make test` and `make lint` pass
4. Open a PR with a clear description
5. Address review feedback

### Commit Messages
Follow conventional commits:
```
feat: add user authentication
fix: resolve race condition in cache
docs: update API documentation
```

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.
```

**Why it's good:**
- Practical steps
- References tooling (make lint, make fmt)
- Commit message format
- Links to detailed guide

**When to skip:** Internal project not accepting external contributions.

---

## Common Mistakes

### Mistake 1: Using Raw Commands Instead of Build System

**Wrong:**
```bash
go test -v -race -coverprofile=coverage.out ./...
```

**Right:**
```bash
make test-coverage
```

If a Makefile/package.json exists, use it. The build system IS the interface.

### Mistake 2: Missing Verification Steps

**Wrong:** Setup instructions with no way to verify success

**Right:** Include verification after setup:
```bash
make test  # All tests should pass
```

### Mistake 3: Outdated Commands

Development docs get outdated quickly. Mitigate by:
- Using build system commands (which are maintained)
- Keeping instructions at the right abstraction level
- Testing your own documentation periodically

### Mistake 4: Too Much Detail

**Wrong:** Explaining every flag and option for every command

**Right:** Cover the common cases. Link to --help for advanced options.

### Mistake 5: Assuming Knowledge

**Wrong:** "Run the migrations" (what command?)

**Right:** `make migrate` or explicit commands

### Mistake 6: Duplicate of README

**Wrong:** Copying installation/usage from README into development.md

**Right:**
- README has user-facing quick start
- development.md has contributor-focused setup
- They serve different audiences

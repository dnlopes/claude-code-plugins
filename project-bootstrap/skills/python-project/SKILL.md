---
name: python-project
description: Canonical Python project reference for scaffolding-project — provides project structure with uv package manager, pytest testing, black/isort/pycln/pyright tooling, Makefile targets, and Renovate rules.
---

# Python Project

Canonical reference for scaffolding a Python project within a repository. This skill is loaded by `scaffolding-project` — it is not invoked directly.

## Project Structure

A scaffolded Python project creates the following in the target subdirectory:

```
{{PY_DIR}}/
├── src/
│   ├── __init__.py    # Package marker (empty)
│   └── main.py        # Application entry point
├── tests/
│   ├── __init__.py    # Package marker (empty)
│   └── unit/
│       ├── __init__.py    # Package marker (empty)
│       ├── conftest.py    # Shared test fixtures
│       └── main_test.py   # Example test
├── pyproject.toml     # Project config, dependencies, and tool settings
└── .python-version    # Python version pin for pyenv/uv
```

The `__init__.py` files are empty package markers. Create them as empty files — do not add content to them.

## User-Provided Variables

scaffolding-project asks the user for these values during the interactive flow:

| Variable | Placeholder | Example | Purpose |
|----------|------------|---------|---------|
| Subdirectory path | `{{PY_DIR}}` | `src-python` | Where the Python project lives |
| Makefile variable name | `{{PY_DIR_VAR}}` | `PY_DIR` | Makefile variable for the directory |
| Project name | `{{PY_PROJECT_NAME}}` | `my-tool` | Name in pyproject.toml |
| Project description | `{{PY_PROJECT_DESCRIPTION}}` | `A utility tool` | Description in pyproject.toml |

## Reference Files

| Reference | Purpose | Parameterized |
|-----------|---------|---------------|
| `reference/main.py` | Entry point skeleton | No |
| `reference/conftest.py` | Shared test fixtures | No |
| `reference/main_test.py` | Example test | No |
| `reference/pyproject.toml` | Project config with uv, black, isort, pycln, pyright, pytest | Yes: `{{PY_PROJECT_NAME}}`, `{{PY_PROJECT_DESCRIPTION}}` |
| `reference/python-version` | Python version pin | No |
| `reference/makefile-targets.mk` | Makefile section with py-local-dev, py-unit-tests, py-local-clean, py-ready | Yes: `{{PY_DIR}}`, `{{PY_DIR_VAR}}` |
| `reference/renovate-rules.json` | Renovate packageRules entry | Yes: `{{PY_DIR}}` |

## Makefile Integration

The Makefile targets are inserted as a new section in the root Makefile. The section includes:

**Variables** (inserted in the Project Variables section):
- A variable for the Python directory path (name chosen by user, e.g., `PY_DIR`, `SRC_DIR`)

**Public targets:**
- `py-local-dev` — install pre-commit hooks and sync dependencies with uv
- `py-unit-tests` — run pytest with coverage
- `py-local-clean` — remove .venv directory
- `py-ready` — run all quality checks (pre-commit, pycln, isort, black, pyright)

**ready target:** If a `ready` target exists in the Makefile, add `py-ready` as a dependency.

**local-dev target:** If a `local-dev` target exists, add `py-local-dev` as a dependency.

## Tooling

The Python project uses `uv` as the package manager (not pip, poetry, or pipenv). All commands run through `uv run` to ensure the correct virtual environment.

| Tool | Purpose | Config Location |
|------|---------|----------------|
| uv | Package management and virtual env | `pyproject.toml` |
| black | Code formatting | `[tool.black]` in pyproject.toml |
| isort | Import sorting | `[tool.isort]` in pyproject.toml |
| pycln | Remove unused imports | `[tool.pycln]` in pyproject.toml |
| pyright | Type checking | `[tool.pyright]` in pyproject.toml |
| pytest | Testing with coverage | `pyproject.toml` dependencies |
| pre-commit | Git hooks for quality checks | `.pre-commit-config.yaml` (user creates) |

## Renovate Integration

A single `packageRules` entry is added to `renovate.json`, grouping Python dependency updates scoped to the project subdirectory via `matchFileNames`.

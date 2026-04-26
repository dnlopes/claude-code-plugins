{{PY_DIR_VAR}} ?= ${CURDIR}/{{PY_DIR}}

############################################################################################################
#### Python Goals ##########################################################################################
############################################################################################################

##@ Python
py-local-dev: ## Setup the local Python environment for development
	cd ${{{PY_DIR_VAR}}} && uv sync
py-unit-tests: ## Run Python unit tests
	cd ${{{PY_DIR_VAR}}} && uv run pytest -s --cov=src --cov-report=term --cov-report=xml --junitxml=junit.xml tests/unit
py-local-clean: ## Cleanup the local Python environment
	rm -rf ${{{PY_DIR_VAR}}}/.venv
py-ready: ## Validates Python code is ready to be reviewed
	cd ${{{PY_DIR_VAR}}} && uv run pycln --config=pyproject.toml src
	cd ${{{PY_DIR_VAR}}} && uv run isort --sp pyproject.toml src
	cd ${{{PY_DIR_VAR}}} && uv run black --config pyproject.toml src
	cd ${{{PY_DIR_VAR}}} && uv run pyright --project pyproject.toml src

.PHONY: py-local-dev py-unit-tests py-local-clean py-ready

{{GO_DIR_VAR}} ?= ${CURDIR}/{{GO_DIR}}
MOCKERY = ./bin/mockery
GOLANGCI_LINT = ./bin/golangci-lint

############################################################################################################
#### Golang goals ##########################################################################################
############################################################################################################

##@ Golang
go-ready: .go-fmt .go-vet go-lint ## Validates Go code is ready to be reviewed
	cd ${{{GO_DIR_VAR}}} && go mod tidy
go-unit-tests: ## Run Go unit tests
	cd ${{{GO_DIR_VAR}}} && go test -v ./... -coverprofile cover.out | tee tests.out
	cd ${{{GO_DIR_VAR}}} && go tool cover -html cover.out -o cover.html
go-lint: ## Run golangci-lint
	cd ${{{GO_DIR_VAR}}} && $(GOLANGCI_LINT) run ./...
go-mocks: ## Generate Go mocks
	cd ${{{GO_DIR_VAR}}} && $(MOCKERY)
go-build: .go-fmt .go-vet ## Build Go project
	cd ${{{GO_DIR_VAR}}} && CGO_ENABLED=0 GO111MODULE=on go build -o ${CURDIR}/bin/{{GO_BINARY_NAME}} cmd/main.go
.go-fmt:
	cd ${{{GO_DIR_VAR}}} && go fmt ./...
.go-vet:
	cd ${{{GO_DIR_VAR}}} && go vet ./...

.PHONY: go-ready go-unit-tests go-lint go-mocks go-build .go-fmt .go-vet

TF_DIR ?= ${CURDIR}/{{TF_DIR}}
TF_INPUTS_FILE ?= ${TF_DIR}/configs/dev.tfvars
TF_WORKSPACE ?= {{TF_WORKSPACE}}
AWS_PROFILE ?= {{AWS_PROFILE}}

############################################################################################################
#### Terraform goals #######################################################################################
############################################################################################################

##@ Terraform
tf-lint: .tf-init ## Lint Terraform configurations
	terraform -chdir=${TF_DIR} fmt -recursive
	terraform -chdir=${TF_DIR} validate
tf-plan: .tf-select-workspace ## Plan the terraform changes
	AWS_PROFILE=${AWS_PROFILE} terraform -chdir=${TF_DIR} plan -lock=false -var-file=${TF_INPUTS_FILE}
tf-apply: .tf-select-workspace ## Apply the terraform changes
	AWS_PROFILE=${AWS_PROFILE} terraform -chdir=${TF_DIR} apply -var-file=${TF_INPUTS_FILE} -auto-approve
tf-lock-file: .tf-init ## Generate the lock file
	terraform -chdir=${TF_DIR} providers lock -platform=windows_amd64 -platform=darwin_amd64 -platform=darwin_arm64 -platform=linux_amd64 -platform=linux_arm64
.tf-init:
	AWS_PROFILE=${AWS_PROFILE} terraform -chdir=${TF_DIR} init
.tf-select-workspace: .tf-create-workspace
	AWS_PROFILE=${AWS_PROFILE} terraform -chdir=${TF_DIR} workspace select ${TF_WORKSPACE}
.tf-create-workspace: .tf-init
	if ! AWS_PROFILE=${AWS_PROFILE} terraform -chdir=${TF_DIR} workspace select ${TF_WORKSPACE} ; then \
		AWS_PROFILE=${AWS_PROFILE} terraform -chdir=${TF_DIR} workspace new ${TF_WORKSPACE}; \
	fi

.PHONY: tf-lint tf-plan tf-apply tf-lock-file .tf-init .tf-select-workspace .tf-create-workspace

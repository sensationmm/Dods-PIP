#! /usr/bin/env bash

# Create token for a deployer role so we can run deployments
# on required environments

set -eo pipefail

function require_env_var {
    local ENV_VAR=$1
    if [[ -z "${!ENV_VAR}" ]]; then
        fail "$ENV_VAR is not set"
    fi  
}

function log {
    MESSAGE=$1
    >&2 echo "$MESSAGE"
}

function fail {
    MESSAGE=$1
    log "ERROR: $MESSAGE"
    exit 1
}

#---- Main -----

require_env_var ENVIRONMENT

Environments=('DEV' 'PRODUCTION' 'QA' 'TEST')

if [[ ! " ${Environments[*]} " =~ " ${ENVIRONMENT^^} " ]]; then
   fail "Unexpected environment: ${ENVIRONMENT}. Must be one of ${Environments[@]}."
fi

E=$(echo ${ENVIRONMENT^^})
ACCOUNT_VAR="${E}_ACCOUNT_ID"
AWS_ACCOUNT=${!ACCOUNT_VAR}

echo "Environment: ${E}. Account ID: ${AWS_ACCOUNT}"

echo "Assuming role for environment $E ..."
# ROLE_CREDS=$(aws sts assume-role \
#                      --external-id EXTERNAL_ID \
#                      --role-arn arn:aws:iam::${AWS_ACCOUNT}:role/terraform-role \
#                      --role-session-name ${AWS_ENV}-deployer
#             )

aws sts assume-role \
                     --external-id EXTERNAL_ID \
                     --role-arn arn:aws:iam::${AWS_ACCOUNT}:role/terraform-role \
                     --role-session-name ${E,,}-deployer \
                  > session_info.json
            
test $? -eq 0 && fail "Failed trying to assume role for $E environment."

ROLE_EXPIRES=$(jq -r '.Credentials.Expiration' session_info.json)
echo "Role valid until $ROLE_EXPIRES"

AWS_ACCESS_KEY_ID=$(jq '.Credentials.AccessKeyId' session_info.json)
AWS_SECRET_ACCESS_KEY=$(jq '.Credentials.SecretAccessKey' session_info.json)
AWS_SESSION_TOKEN=$(jq '.Credentials.SessionToken' session_info.json)

echo "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID"
echo "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY"
echo "AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN"
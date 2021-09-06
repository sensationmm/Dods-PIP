#! /usr/bin/env bash

# Utility script to update docker image on a Fargate service task definition
# takes as input the service name
set -eo pipefail

feService=$(echo ${FRONTEND_SRC/\//-})
feService=$(echo ${feService/_/-})
feManifest="../infra/copilot/${feService}/manifest.yml"

echo "Copilot's service: $feService"
echo "Deployment environment: ${BITBUCKET_DEPLOYMENT_ENVIRONMENT}"
echo "Frontend service manifest: ${feManifest}"

# Replace container image on the manifest with recently built one
echo "container image: ${IMAGE_NAME}"
safeImage=$(echo ${IMAGE_NAME//\//\\/})
perl -pi.bak -e "s/location: ${AWS_ECR_NAME}.*$/location: ${safeImage}/" $feManifest
cat $feManifest

printf '\n------------------------------ %s\n', "Deploying ${feService}"
cd ../infra/copilot
copilot svc deploy -n $feService -e ${BITBUCKET_DEPLOYMENT_ENVIRONMENT}
exit 0
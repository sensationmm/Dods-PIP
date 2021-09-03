#! /usr/bin/env bash

# Utility script to update docker image on a Fargate service task definition
# takes as input the service name

SERVICE=$1
JSON_OUT='task-template.json'
TD='task-definition.json'

feService=$(echo ${SERVICE//\//-})
feManifest="../infra/copilot/${feService}/manifest.yml"

echo "Copilot's service: $feService"
echo "Deployment environment: ${BITBUCKET_DEPLOYMENT_ENVIRONMENT}"
echo "Frontend service manifest: ${feManifest}"

# Replace container image on the manifest with recently built one
echo "container image: ${IMAGE_NAME}"
perl -pi.bak -e "s/location: ${AWS_ECR_NAME}.*$/${IMAGE_NAME}/" $feManifest
cat $feManifest
exit 0

echo "1/5: Checking task definition for service ${SERVICE}"
export TASK_DEFINITION=$(
   aws ecs describe-services --cluster ${FARGATE_CLUSTER} \
    --services ${SERVICE} \
    --query 'services[].taskDefinition[]'  \
    --output text
)
echo "     ${TASK_DEFINITION}"

echo "2/5: Building JSON from current task definition..."
aws ecs describe-task-definition  \
  --query '{
      containerDefinitions: taskDefinition.containerDefinitions, 
      family: taskDefinition.family, 
      taskRoleArn: taskDefinition.taskRoleArn, 
      executionRoleArn: taskDefinition.executionRoleArn, 
      networkMode: taskDefinition.networkMode, 
      volumes: taskDefinition.volumes, 
      placementConstraints: taskDefinition.placementConstraints, 
      requiresCompatibilities: taskDefinition.requiresCompatibilities, 
      cpu: taskDefinition.cpu, 
      memory: taskDefinition.memory
   }' \
  --task-definition ${TASK_DEFINITION} > ${JSON_OUT}

if [[ -s ${JSON_OUT} ]]; then
   echo "     JSON acquired."
else 
   echo "     Failed."
   exit 1
fi

echo "3/5: Updading image version on task definition..."
jq --arg new_image ${IMAGE_NAME} '.containerDefinitions[].image = $new_image' < ${JSON_OUT} >  ${TD} && \
echo "     JSON updated."

echo "4/5: Sending updated definition to Fargate service..."
export UPDATED_TASK_DEFINITION=$(aws ecs register-task-definition \
   --cli-input-json file://${TD} \
    | jq '.taskDefinition.taskDefinitionArn' --raw-output) && \
echo "     Generated ${UPDATED_TASK_DEFINITION}."

echo "5/5: Updating service with new task definition"
aws ecs update-service --service ${SERVICE} --cluster ${FARGATE_CLUSTER} --task-definition ${UPDATED_TASK_DEFINITION} && \
echo "     Updated."
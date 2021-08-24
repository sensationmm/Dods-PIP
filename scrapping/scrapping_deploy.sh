#! /usr/bin/env bash

set -euo pipefail

rootDir=$PWD
# Get all folders with serverless.yml file
IFS=$'\n'
services=($(find . -name "serverless.yml"))
unset IFS

# Go to each one and run deployment
for service in "${services[@]}"; do
  folder=$(dirname $service)
  echo "Located service at ${folder}"
  cd $folder
  echo "Deploying ..."
  npm install
  sls deploy
  cd $rootDir 
done
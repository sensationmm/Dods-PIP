#! /usr/bin/env bash

# This should specify commands to run tests defined on the parent folder.
# This script will be called from the parent folder so make the right
#  assumptions about location of files

npm ci
export SERVERLESS_PORT=3000
SERVERLESS_STAGE=dev npm run test:coverage

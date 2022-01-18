#! /usr/bin/env bash

SLS_DEBUG=* npx serverless deploy --stage ${ENVIRONMENT,,}
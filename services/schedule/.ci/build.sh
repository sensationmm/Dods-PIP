#! /usr/bin/env bash

npm ci
SERVERLESS_STAGE=dev npm run test
npx serverless package
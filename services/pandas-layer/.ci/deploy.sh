#! /usr/bin/env bash

npm install

cd layers/pandas
./build_layer.sh
cd ../..
npx serverless deploy --stage ${ENVIRONMENT,,}
exit 0

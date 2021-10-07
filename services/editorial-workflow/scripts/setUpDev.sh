#!/bin/bash

bash ./scripts/tearDown.sh
bash ./scripts/setUpMockServers.sh
ts-node ./tests/integrationTests/helpers/setupAndLoadMockServers.ts
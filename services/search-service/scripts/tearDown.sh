#!/bin/bash

kill -9 $(lsof -t -i:3000) 2> /dev/null
kill -9 $(lsof -t -i:3002) 2> /dev/null


fileNames=$(ls -1 tests/integrationTests/downstreamDefinitions)

for fileName in $fileNames
do

    echo $(docker rm -f ${fileName}_mockserver 2> /dev/null) stopped
    
done
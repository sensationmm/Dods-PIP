#!/bin/bash

fileNames=$(ls -1 tests/integrationTests/downstreamDefinitions)

for fileName in $fileNames
do
    echo "Processing $fileName"
    
    json=$(npx yaml2json tests/integrationTests/downstreamDefinitions/$fileName)
    
    url=$(echo $json | jq -r .servers[0].url)
    
    port=${url##*:}
    
    exists=$(docker ps --filter publish=${port} -q)
    
    if [ -z $exists ]
    then
        TMPFILE=.offline$$.log
        
        docker run --rm --name ${fileName}_mockserver -p ${port}:${port} mockserver/mockserver -logLevel INFO -serverPort ${port} &> $TMPFILE &
        
        PID=$!
        
        TIMEOUT=30
        while ! grep "INFO ${port} started on port: ${port}" $TMPFILE
        do
            sleep 1;
            # cat $TMPFILE
            
            if grep "already in use by container" $TMPFILE || grep "port is already allocated" $TMPFILE
            then
                break
            fi
            
        done
        rm $TMPFILE
    else
        echo $port port already in use
    fi
    
done

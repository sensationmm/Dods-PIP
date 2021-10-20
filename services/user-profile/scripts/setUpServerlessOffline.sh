#!/bin/bash
mkdir -p coverage
TMPFILE=.offline$$.log
sleep 5
export stage=test
NODE_ENV=test serverless offline start --stage test &> $TMPFILE &
PID=$!
TIMEOUT=30
while ! grep "server ready" $TMPFILE
do
    sleep 1;
    cat $TMPFILE
done
rm $TMPFILE

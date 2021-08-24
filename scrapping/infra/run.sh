#! /usr/bin/env bash
cdk synth

#Before first time deploy (optional?)
cdk bootstrap

cdk diff
cdk deploy
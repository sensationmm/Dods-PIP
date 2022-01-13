#!/bin/bash

## TODO: fix following description
##
# List all dependencies between projects.
# Poject is identified with relative path to project's root directory from repository root.
#
# Dependencies can be specified in text file where each line is path (from monorepo root) to other project.
# Default location of dependency file is in root dir of each project on path `.ci/dependencies.txt`.
# Location of dependency file can be changed by setting environment variable `CI_DEPENDENCIES_FILE`.
#
# Outputs lines of tuples in format PROJECT1 PROJECT2 (separated by space), 
# where PROJECT1 depends on PROJECT2.
#
# Usage:
#   list-dependencies.sh
##

set -e

# Find script directory (no support for symlinks)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
 
# Configuration with default values
: "${CI_DEPLOYMENTS_FILE:=.ci/deployments.txt}"

# Validate requirements
if [[ "$#" -eq 0 ]]; then
    echo "ERROR: No folder project specified. You must provide a project folder as input parameter."
    exit 1
fi

PROJECT=$1

# Look into deployments file where each row is an environment to deploy to
DEPLOYMENTS_FILE="$DIR/../$PROJECT/$CI_DEPLOYMENTS_FILE"
if [[ -f $DEPLOYMENTS_FILE ]]; then
    for ENV in $(cat $DEPLOYMENTS_FILE); do 
        echo "$ENV"
    done
else
    echo "ERROR: Could NOT find list of environments to deploy, should be $DEPLOYMENTS_FILE"
    exit 1
fi

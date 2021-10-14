#!/usr/bin/env bash

##
# List all dependencies between packages.
# Package is identified with relative path to package's root directory from repository root.
#
# Dependencies can be specified in text file where each line is path (from monorepo root) to other package.
# Default location of dependency file is in root dir of each package on path `.ci/dependencies.txt`.
# Location of dependency file can be changed by setting environment variable `CI_DEPENDENCIES_FILE`.
#
# Outputs lines of tuples in format PACKAGE1 PACKAGE2 (separated by space), 
# where PACKAGE1 depends on PACKAGE2.
#
# Usage:
#   list-dependencies.sh
##

set -e

# Find script directory (no support for symlinks)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
 
# Configuration with default values
# "${CI_DEPENDENCIES_FILE:=dependencies.txt}"
# CI_DEPENDENCIES_FILE=dependencies.txt
DEPENDENCIES_FILE=dependencies.txt

# Look for dependecies of each package
for PACKAGE in $(${DIR}/list-packages.sh); do
    PACKAGE=${PACKAGE%\*}

    #- TODO: Implement dependency listing based on Bazel configuration -#

    # Temporarily look into dependency file where each row is path to other package
    CI_DEPENDENCIES_FILE="$DIR/../$PACKAGE/$DEPENDENCIES_FILE"

    if [[ -f $CI_DEPENDENCIES_FILE ]]; then
        for INCLUDE in $(cat $CI_DEPENDENCIES_FILE); do 
            echo "$PACKAGE $INCLUDE"
        done
    fi
done

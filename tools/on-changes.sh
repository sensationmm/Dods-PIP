#!/bin/bash

##
# Main entry for monorepository build.
# Triggers builds for all modified projects in order respecting their dependencies.
# 
# Usage:
#   build.sh
##

set -e

# Parse script invocation
case $1 in
   build)
     OPTION='build'  
     ;;
   deploy)
     OPTION='deploy'
     ;;
   *)
     echo "ERROR: I only know how to 'build' or 'deploy'."
     exit 1
     ;;
esac

# Find script directory (no support for symlinks)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Configuration with default values
: "${CI_TOOL:=bitbucket}"
: "${CI_PLUGIN:=$DIR/${CI_TOOL}.sh}"

# Resolve commit range for current build 
LAST_SUCCESSFUL_COMMIT=$(${CI_PLUGIN} hash last)
echo "Last commit: ${LAST_SUCCESSFUL_COMMIT}"
if [[ ${LAST_SUCCESSFUL_COMMIT} == "null" ]]; then
    COMMIT_RANGE="origin/master"
else
    COMMIT_RANGE="$(${CI_PLUGIN} hash current)..${LAST_SUCCESSFUL_COMMIT}"
fi
echo "Commit range: $COMMIT_RANGE"

# Ensure we have all changes from last successful build
if [[ -f $(git rev-parse --git-dir)/shallow ]]; then
    if [[ ${LAST_SUCCESSFUL_COMMIT} == "null" ]]; then
        git fetch --unshallow
    else 
        DEPTH=1
        until git show ${LAST_SUCCESSFUL_COMMIT} > /dev/null 2>&1
        do
            DEPTH=$((DEPTH+5))
            echo "Last commit not fetched yet. Fetching depth $DEPTH."
            git fetch --depth=$DEPTH
        done
    fi
fi

# Get list of folders for know projects
PROJECTS_WITH_CHANGES=$($DIR/list-projects-to-build.sh $COMMIT_RANGE)

# If nothing to build inform and exit
if [[ -z "$PROJECTS_WITH_CHANGES" ]]; then
    echo "No changes detected on known projects."
    exit 0
fi

echo "Need to $OPTION following projects"
echo -e "*** $PROJECTS_WITH_CHANGES ***"

# Build or deploy all modified projects
echo -e "$PROJECTS_WITH_CHANGES" | while read PROJECTS; do
    CI_PLUGIN=${CI_PLUGIN} $DIR/${OPTION}-projects.sh ${PROJECTS}
done;

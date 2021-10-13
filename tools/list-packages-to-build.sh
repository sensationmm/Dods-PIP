#!/bin/bash

# Documentation
read -r -d '' USAGE_TEXT << EOM
Usage:
    list-packages-to-builds.sh <revision range>

    List all packages which had some changes in given commit range.
    Package is identified with relative path to packages's root directory from repository root.
    Output list is ordered respecting dependencies between projects (lower packages depends on upper).
    There can be multiple packages (separated by space) on single line which means they can be build on parallel.
   
    If one of commit messages in given commit range contains [rebuild-all] flag then all packages will be listed.

    <revision range>       range of revision hashes where changes will be looked for
                            format is HASH1..HASH2
EOM

set -e

# Capture input parameter and validate it
COMMIT_RANGE=$1
COMMIT_RANGE_FOR_LOG="$(echo $COMMIT_RANGE | sed -e 's/\.\./.../g')"

if [[ -z $COMMIT_RANGE ]]; then
    echo "ERROR: You need to provide revision range in format HASH1..HASH2 as input parameter"
    echo "$USAGE_TEXT"
    exit 1
fi    

# Find script directory (no support for symlinks)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Look for changes in given revision range
echo "Look for changes in given revision range" >&2
CHANGED_PATHS=$(git diff $COMMIT_RANGE --name-status)
echo -e "Changed paths:\n$CHANGED_PATHS"  >&2

# Look for dependencies between packages
PACKAGE_DEPENDENCIES=$(${DIR}/list-dependencies.sh)

# Setup variables for output collecting 
CHANGED_PACKAGES=""
CHANGED_DEPENDENCIES=""

##
# Recusively look for packages which depends on given packages.
# Outputs lines of tuples in format PACKAGE1 PACKAGE2 (separated by space), 
# where PACKAGE1 depends on PACKAGE2.
# 
# Input:
#   PACKAGE - id of packages
##
function process_dependants {
    local PACKAGE=$1
    local DEPENDENCIES=$(echo "$PACKAGE_DEPENDENCIES" | grep ".* $PACKAGE")
    echo "$NEW_DEPENDENCIES" | while read DEPENDENCY; do
        DEPENDENCY=$(echo "$DEPENDENCY" | cut -d " " -f1)
        if [[ ! $(echo "$CHANGED_PACKAGES" | grep "$DEPENDENCY") ]]; then
            NEW_DEPENDENCIES="$DEPENDENCIES\n$(process_dependants $DEPENDENCY)"
        fi
    done    
    echo -e "$DEPENDENCIES"
}

# If [rebuild-all] command passed it's enought to take all projects and all dependencies as changed
if [[ $(git log "$COMMIT_RANGE_FOR_LOG" | grep "\[rebuild-all\]") ]]; then
    CHANGED_PACKAGES="$(${DIR}/list-projects.sh)"
    CHANGED_DEPENDENCIES="$PROJECT_DEPENDENCIES"
else    
    # For all known projects check if there was a change and look for all dependant projects
    for PACKAGE in $(${DIR}/list-packages.sh); do
        PACKAGE_NAME=$(basename $PACKAGE)
        if [[ $(echo -e "$CHANGED_PATHS" | grep "$PACKAGE") ]]; then                
            CHANGED_PACKAGES="$CHANGED_PACKAGES\n$PACKAGE"
            CHANGED_DEPENDENCIES="$CHANGED_DEPENDENCIES\n$(process_dependants $PACKAGE)"
        fi               
    done
fi

# Build output 
PACKAGES_TO_BUILD=$(echo -e "$CHANGED_DEPENDENCIES" | tsort | tac)
for PACKAGE in $(echo -e "$CHANGED_PACKAGES"); do
    if [[ ! $(echo -e "$PACKAGES_TO_BUILD" | grep "$PACKAGE") ]]; then    
        PACKAGES_TO_BUILD="$PACKAGE $PACKAGES_TO_BUILD"
    fi
done

# Print output
echo -e "$PACKAGES_TO_BUILD"

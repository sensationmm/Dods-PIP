#!/usr/bin/env bash

##
# Main entry for the repository build.
# Triggers builds for all modified projects in order respecting their dependencies.
# 
# Usage:
#   build.sh
##

# Documentation 
read -r -d '' USAGE_TEXT << EOM
Usage: bitbucket.sh command [<param>...]
Run given command in bitbucket pipelines.

Requires bitbucket environment variables (additional may be required for specific commands):
    BITBUCKET_USER
    BITBUCKET_PASSWORD
    BITBUCKET_REPO_FULL_NAME
    
Available commands:  
    build <project_name>    start build of given project
                            outputs build number
                            requires: BITBUCKET_BRANCH
    status <build_number>   get status of build identified by given build number
                            outputs one of: success | failed | null
    kill <build_number>     kills running build identified by given build number                            
    hash <position>         get revision hash on given positions
                            available positions:
                                last        hash of last succesfull build commit
                                            only commits of 'build' job are considered
                                            accepts: BITBUCKET_BRANCH, if ommited no branch filtering
                                current     hash of current commit
                                            requires: BITBUCKET_COMMIT                         
    help                    display this usage text                             
EOM

set -e

# Constants
# TODO: There is different link for bitbucket projects (../project/bitbucket/..)
BITBUCKET_URL="https://api.bitbucket.org/2.0/repositories/${BITBUCKET_REPO_FULL_NAME}"

# Functions

##
# Print message on stderr to do not affect stdout which can be used as input to another commands.
#
# Input:
#    MESSAGE - message to print
#
function log {
    MESSAGE=$1
    >&2 echo "$MESSAGE"
}

##
# Print error message and exit program with status code 1
#
# Input:
#   MESSAGE - error message to show
##
function fail {
    MESSAGE=$1
    log "ERROR: $MESSAGE"
    log "$USAGE_TEXT"
    exit 1
}

##
# Fast fail when given environment variable is not set.
#
# Input:
#   ENV_VAR - name of environment variable to check
##
function require_env_var {
    local ENV_VAR=$1
    if [[ -z "${!ENV_VAR}" ]]; then
        fail "$ENV_VAR is not set"
    fi  
}

##
# Fast fail when given parameter is empty
#
# Input:
#   MESSAGE - message to show when requirement is not met
#   PARAM - parameter which should be not null
##
function require_not_null {
    local MESSAGE=$1
    if [[ -z "$2" ]]; then
        fail "$MESSAGE"
    fi
}

##
# Make HTTP POST call to bitbucket
#
# Input:
#   URL - part of URL after bitbucket base url
#   DATA - form data to post (optional)
##
function post {
    local URL=$1
    local DATA=$2
    if [[ ! -z $DATA ]]; then
        DATA="-H 'Content-Type: application/json' -d '$DATA'"
    fi
    eval "curl -XPOST -s -g -u ${BITBUCKET_USER}:${BITBUCKET_PASSWORD} ${DATA} ${BITBUCKET_URL}/${URL}"
}

##
# Make HTTP GET call to bitbucket
#
# Input:
#   URL - part of URL after bitbucket base url
##
function get {
    local URL=$1
    curl -s -g -u ${BITBUCKET_USER}:${BITBUCKET_PASSWORD} ${BITBUCKET_URL}/${URL}
}

##
# Get status of bitbucket build
#
# Input:
#   BUILD_NUM - build identification number
#
# Output:
#   success | failed | null
##
function get_build_status {
    local BUILD_NUM=$1
    require_not_null "Build number not speficied" ${BUILD_NUM} 
    STATUS_RESPONSE=$(get pipelines/${BUILD_NUM})
    STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.state.result.name')
    case $STATUS in
        SUCCESSFUL)
            echo "success"
            ;;
        FAILED)
            echo "failed"
            ;;
        *)
            echo "null"
            ;;
    esac
}

##
# Get revision hash of last successful commit which invokes main monorepository build
#
# Output:
#   revision hash or null when there were no commits yet
##
function get_last_successful_commit {
    #TODO handle case when last successful commit is not on page
    if [[ -z "$BITBUCKET_BRANCH" ]]; then
        SELECTOR='.target.selector.type=="default"'
    else
        SELECTOR='(.target.selector.type=="branches") and (.target.selector.pattern=="'${BITBUCKET_BRANCH}'")'
    fi
    get "pipelines/?sort=-created_on&status=PASSED&status=SUCCESSFUL&page=1&pagelen=50" \
        | jq --raw-output "[.values[]|select($SELECTOR)] | max_by(.build_number).target.commit.hash"
}

function get_origin_commit {
    require_env_var BITBUCKET_BRANCH
    get "commits/?include=${BITBUCKET_BRANCH}&exclude=master" \
        | jq --raw-output  "[.values[].parents[].hash]|last"
}

##
# Get revision hash of current commit
#
# Output:
#   revision hash or null when there were no commits yet
##
function get_current_commit {
    require_env_var BITBUCKET_COMMIT
    echo "$BITBUCKET_COMMIT"
}

##
# Main
##

set -e

# Validate common requirements
require_env_var BITBUCKET_USER
require_env_var BITBUCKET_PASSWORD
require_env_var BITBUCKET_REPO_FULL_NAME

# Find script directory (no support for symlinks)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Resolve commit range for current build 
LAST_SUCCESSFUL_COMMIT=$(get_last_successful_commit)
# LAST_SUCCESSFUL_COMMIT=$(get_origin_commit)
echo "Last commit: ${LAST_SUCCESSFUL_COMMIT}"
if [[ ${LAST_SUCCESSFUL_COMMIT} == "null" ]]; then
    COMMIT_RANGE="origin/master"
else
    COMMIT_RANGE="$(get_current_commit)..${LAST_SUCCESSFUL_COMMIT}"
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

# Collect all modified packages
PACKAGES_TO_BUILD=$($DIR/tools/list-packages-to-build.sh $COMMIT_RANGE)

# If nothing to build inform and exit
if [[ -z "$PACKAGES_TO_BUILD" ]]; then
    echo "No packages to build"
    exit 0
fi

echo "Following packages need to be built"
echo -e "$PACKAGES_TO_BUILD"

# Build all modified packages
echo -e "$PACKAGES_TO_BUILD" | while read PACKAGES; do
   #  $DIR/tools/build-packages.sh ${PACKAGES}
   echo "TODO: run build on ${PACKAGES}"
done
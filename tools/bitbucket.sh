#!/usr/bin/env bash

# Documentation 
read -r -d '' USAGE_TEXT << EOM
Usage: bitbucket.sh command [<param>...]
Run given command in bitbucket pipelines.

Requires bitbucket environment variables (additional may be required for specific commands):
    BITBUCKET_USER
    BITBUCKET_PASSWORD
    BITBUCKET_REPO_FULL_NAME
    
Available commands:  
    build <job> <project_name>  Starts the build <job> of given project
                                outputs build number
                                requires: BITBUCKET_BRANCH

    deploy <job> <project_name> <environment>  Starts the deployment <job> of given project
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
# Trigger build in bitbucket
#
# Input:
#   JOB_NAME - custom job to handle type of project build
#   PROJECT_NAME - name of project to start build for
#
# Output:
#   build number
##
function trigger_build {
    local JOB_NAME=$1
    local SERVICE=$2
    require_env_var BITBUCKET_BRANCH
    require_not_null "Job name not speficied" ${JOB_NAME} 
    require_not_null "Service name not speficied" ${SERVICE} 
    BODY="$(cat <<-EOM
    {
        "target": {
            "selector": {
                "type": "custom",
                "pattern": "$JOB_NAME"
            },
            "type": "pipeline_ref_target",
            "ref_name": "$BITBUCKET_BRANCH",
            "ref_type": "branch"
        },
        "variables": [
            {
                "key": "SERVICE",
                "value": "$SERVICE"
            }
        ]
    }   
EOM
    )"
    TRIGGER_RESPONSE=$(post "pipelines/" "${BODY}")
    echo "$TRIGGER_RESPONSE" | jq -r '.["uuid"]'
}

##
# Trigger deployment in bitbucket
#
# Input:
#   JOB_NAME - custom job to handle type of project deployment
#   PROJECT_NAME - name of project to start deployment for
#   ENVIRONMENT - AWS environment to deploy project on
#
# Output:
#   build number
##
function trigger_deploy {
    local JOB_NAME=$1
    local SERVICE=$2
    local ENVIRONMENT=$3
    require_env_var BITBUCKET_BRANCH
    require_not_null "Job name not speficied" ${JOB_NAME} 
    require_not_null "Service name not speficied" ${SERVICE} 
    require_not_null "Environment not speficied" ${ENVIRONMENT} 

    BODY="$(cat <<-EOM
    {
        "target": {
            "selector": {
                "type": "custom",
                "pattern": "$JOB_NAME"
            },
            "type": "pipeline_ref_target",
            "ref_name": "master",
            "ref_type": "branch"
        },
        "variables": [
            {
                "key": "SERVICE",
                "value": "$SERVICE"
            },
            {
                "key": "ENVIRONMENT",
                "value": "$ENVIRONMENT"
            }
        ]
    }   
EOM
    )"
    TRIGGER_RESPONSE=$(post "pipelines/" "${BODY}")
    echo "$TRIGGER_RESPONSE" | jq -r '.["uuid"]'
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
# Kill bitbucket build
#
# Input:
#   BUILD_NUM - build identification number
##
function kill_build {
    local BUILD_NUM=$1
    require_not_null "Build number not speficied" ${BUILD_NUM} 
    STATUS_RESPONSE=$(post pipelines/${BUILD_NUM}/stopPipeline)
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

# Validatate common requirements
require_env_var BITBUCKET_USER
require_env_var BITBUCKET_PASSWORD
require_env_var BITBUCKET_REPO_FULL_NAME

# Parse script invocation
case $1 in
    build)        
      trigger_build $2 $3
      ;;
    deploy)
      trigger_deploy $2 $3 $4
      ;;
    status)
      get_build_status $2
      ;;
    kill)
      kill_build $2
      ;;    
    hash)
      case $2 in
        last)
          get_last_successful_commit
          ;;
        current)
          get_current_commit
            ;;
        *)
          fail "Unknown hash position $2"             
          ;;
      esac
      ;;        
    *)
      fail "Unknown command $1"
      ;;        
esac
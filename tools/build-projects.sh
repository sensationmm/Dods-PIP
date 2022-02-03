#!/usr/bin/env bash

# Documentation
read -r -d '' USAGE_TEXT << EOM
Usage:
  build-projects.sh <project>...

  Trigger custom pipeline for a given project, wait until all potential jobs are successful.
  Project is identified with relative path to project's root directory from repository root.
  When one of build fail then exit with error message.

  Configurable with additional environment variables:
      BUILD_MAX_SECONDS - maximum time in seconds to wait for all builds (15 minutes by default)
      BUILD_CHECK_AFTER_SECONDS - delay between checking status of builds again (15 seconds by default)  
  
  <project>       name of project to build
                  minimally one, can be multiple
EOM

set -e

# Find script directory (no support for symlinks)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Configuration with default values
: "${BUILD_MAX_SECONDS:=$(( 15 * 60 ))}"
: "${BUILD_CHECK_AFTER_SECONDS:=15}"
: "${CI_PLUGIN:=$DIR/bitbucket.sh}"

# Validate requirements
if [[ "$#" -eq 0 ]]; then
    echo "ERROR: No projects to build. You must provide at least one project as input parameter."
    echo "$USAGE_TEXT"
    exit 1
fi

# Trigger build for all given projects
PROJECTS=()
for PROJECT in $@; do
    echo "Working with $PROJECT from $DIR"
    PROJECT_NAME=${PROJECT##*/}  #basename
    PROJECT_FOLDER=${PROJECT%/*}   #dirname
    if [[ ! -d $DIR/../$PROJECT ]]; then
       echo "$PROJECT is not a folder, skipping ..."
       continue
    fi
    JOB_NAME="build_${PROJECT_FOLDER}"
    echo "Triggering 'build' job $JOB_NAME with ENV $PROJECT_NAME"
    BUILD_NUM=$(${CI_PLUGIN} build $JOB_NAME $PROJECT_NAME)    
    if [[ -z ${BUILD_NUM} ]] || [[ ${BUILD_NUM} -eq "null" ]]; then
        echo "WARN: No build triggered for project '$PROJECT'. Please check if pipeline $JOB_NAME is defined in your build tool."
    else 
        echo "Build triggered for project '$PROJECT' with number '$BUILD_NUM'"    
        PROJECTS=(${PROJECTS[@]} "$PROJECT,$BUILD_NUM,null")
    fi
done;

# Check build status loop
for (( BUILD_SECONDS=0; BUILD_SECONDS<=${BUILD_MAX_SECONDS}; BUILD_SECONDS+=$BUILD_CHECK_AFTER_SECONDS )); do

    # First request status for all not yet finished builds
    for PROJECT_INDEX in "${!PROJECTS[@]}"; do 
        PROJECT_INFO=${PROJECTS[$PROJECT_INDEX]}
        PROJECT=$(echo "$PROJECT_INFO" | cut -d "," -f1)     
        BUILD_NUM=$(echo "$PROJECT_INFO" | cut -d "," -f2)    
        BUILD_OUTCOME=$(echo "$PROJECT_INFO" | cut -d "," -f3)
        if [[ "$BUILD_OUTCOME" == "null" ]]; then            
            BUILD_OUTCOME=$(${CI_PLUGIN} status ${BUILD_NUM})
            PROJECTS[$PROJECT_INDEX]="$PROJECT,$BUILD_NUM,$BUILD_OUTCOME"
        fi    
    done

    # Then collect build status summary
    SUCCESSFUL_COUNT=0
    BUILDS_RUNNING=""
    for PROJECT_INFO in "${PROJECTS[@]}"; do     
        PROJECT=$(echo "$PROJECT_INFO" | cut -d "," -f1)     
        BUILD_NUM=$(echo "$PROJECT_INFO" | cut -d "," -f2)    
        BUILD_OUTCOME=$(echo "$PROJECT_INFO" | cut -d "," -f3)
        case "$BUILD_OUTCOME" in
            failed)
                echo "Build failed for project '$PROJECT($BUILD_NUM)'"
                exit 1
                ;;
            success)
                SUCCESSFUL_COUNT=$((SUCCESSFUL_COUNT+1))            
                ;;
            skipped)
                echo "WARN: Build was skipped for project '$PROJECT'. Please check if pipeline is defined in your build tool."
                SUCCESSFUL_COUNT=$((SUCCESSFUL_COUNT+1))            
                ;;
            *)
                BUILDS_RUNNING="$BUILDS_RUNNING $PROJECT($BUILD_NUM)"
                ;;
        esac    
    done

    # At the end check if all all builds are done
    if [[ ${SUCCESSFUL_COUNT} < ${#PROJECTS[@]} ]]; then
        for RUNNING in $(echo "$BUILDS_RUNNING"); do 
            echo "Waiting for build $RUNNING..."
        done
        sleep ${BUILD_CHECK_AFTER_SECONDS}        
    else
        echo "Build successful for all projects: $@"
        exit 0
    fi

done    

echo "Timeout! Some builds were not finished within $BUILD_MAX_SECONDS seconds."
echo "Not finished builds:"
for RUNNING in $(echo "$BUILDS_RUNNING"); do 
    echo "  $RUNNING"
    BUILD_NUM=$(echo $RUNNING | sed -r 's/.*\(([0-9]+)\)/\1/')
    ${CI_PLUGIN} kill ${BUILD_NUM}
done
echo "All not finished builds were killed"
exit 1

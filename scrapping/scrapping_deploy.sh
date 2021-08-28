#! /usr/bin/env bash

set -eo pipefail

rootDir=$PWD

function deployAll() {
  # Get all sub-folders with serverless.yml file
  IFS=$'\n'
  services=($(find . -name "serverless.yml"))
  unset IFS

  # Go to each sub-folder and run deployment
  for service in "${services[@]}"; do
    folder=$(dirname $service)
    printf '\n-------------------------------------'
    cd $folder

    echo "Deploying service at ${folder} ..."
    deploymentSteps
    cd $rootDir 
  done
}

function deploymentSteps() {
    npm install
    pip3 install -r requirements.txt
    sls deploy
}

function getRE(){
   tmp=$1
   tmp1=$( echo ${tmp/\./\\\.})
   caseRE=$( echo ${tmp1/\*/(.*)})
   echo $caseRE
}

#-- main --

# Only rebuild on changes to these type of file
buildOnChangesTo=('*.py' '*.ts' '*.js' '*.json' 'serverless.yml')

# Changes on these folders trigger rebuild on all lambda folders
specialFolders=('lib' 'templates')                  

# Folders to rebuild according to changes
declare -A buildThis
# Determine what changed in current commit
committedChanges=$(git diff ${BITBUCKET_COMMIT}^! --stat=180,120 --compact-summary)
readarray -t changesList <<<"${committedChanges}"

re_changes='[:alnum:]+.*\|'

for line in "${changesList[@]}"; do
   if [[ $line =~ $re_changes ]]; then
      fileChanged=$(echo $line | cut -f1 -d\|)

      fileName=$( echo ${fileChanged##*/} ) 
      pathChanged=$( echo ${fileChanged%/*} )
      folderChanged=$( echo ${pathChanged##scrapping\/} )
      # echo "$fileName was changed on folder $folderChanged"
      buildThis["$folderChanged"]="true"

      # If there a change on a "special" folder break early - Deploy all
      if [[ ${specialFolders[@]} =~ $folderChanged ]]; then
         break
      fi

      # for case in "${buildOnChangesTo[@]}"; do
      #    caseRE=$(getRE $case)
      #    echo "does $fileName match $caseRE"
      #    if [[ $fileName =~ $caseRE ]]; then
      #       echo "$fileName means rebuild"
      #       buildThis["$folderChanged"]="true"
      #       break
      #    fi
      # done
   fi
done

# Nothing to build for changes on root of scrapping 
if [[ ${buildThis['scrapping']} ]]; then
  unset buildThis['scrapping']
fi

echo "Found buildable changes on ${#buildThis[@]} folders: ${!buildThis[@]}"

if [[ ${#buildThis[@]} -eq 0 ]]; then
   echo "* Nothing to build *"
   exit 0
fi

for special in "${specialFolders[@]}"; do
  if [[ ${buildThis[$special]} == "true" ]]; then
     echo "------------------------------"
     echo "Build All folders"
     deployAll
     exit 0
  fi
done

for folder in "${!buildThis[@]}"; do
   echo "------------------------------"
   echo "Building $folder"
   cd $folder
   echo $PWD
   deploymentSteps
   cd $rootDir
   exit 0
done

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

begins_with_short_option()
{
	local first_option all_short_options='VT'
	first_option="${1:0:1}"
	test "$all_short_options" = "${all_short_options/$first_option/}" && return 1 || return 0
}

_arg_verbose=0
_arg_test=0

parse_commandline()
{
	while test $# -gt 0
	do
		_key="$1"
		case "$_key" in
			-V|--verbose)
				_arg_verbose=$((_arg_verbose + 1))
				;;
			-T|--test)
				_arg_test=$((_arg_test + 1))
				;;
		esac
		shift
	done
}

#-- main --

parse_commandline "$@"
# Changes on these folders trigger rebuild on all lambda folders
specialFolders=('lib' 'templates')                  

# Folders to rebuild according to changes
declare -A buildThis
# Determine what changed in current commit
committedChanges=$(git diff master..${BITBUCKET_BRANCH} --compact-summary --stat=180,120)
readarray -t changesList <<<"${committedChanges}"

#re_changes="(scrapping\/(.*)/(.*\..+)) *\|"
re_changes='(scrapping\/(.*)\/(.*\.[[:alnum:]]+))[[:space:]]+\|'
re_newOrRemoved='(scrapping\/(.*)\/(.*\.[[:alnum:]]+).*\((.*)\))[[:space:]]+\|'

[[ $_arg_verbose -gt 0 ]] && echo "verbose mode ON"

for line in "${changesList[@]}"; do
   
   [[ $_arg_verbose -gt 0 ]] && echo "$line"
   # Handle output for new or removed files in the repo
   if [[ $line =~ $re_newOrRemoved ]]; then
      folderChanged=${BASH_REMATCH[2]}
      fileName=${BASH_REMATCH[3]}
      changeType=${BASH_REMATCH[4]}
   fi

   # Handle output for changed files in the repo
   if [[ $line =~ $re_changes ]]; then
      folderChanged=${BASH_REMATCH[2]}
      fileName=${BASH_REMATCH[3]}
      changeType='changed'
   fi

   [[ $_arg_verbose -gt 0 ]] && echo "$fileName is $changeType on folder $folderChanged"
   # Gone files do NOT merit a rebuild - To consider if we should handle a destroy
   if [[ "$changeType" == "gone" ]]; then
      continue
   fi
   [[ $_arg_verbose -gt 0 ]] && echo "$folderChanged will need a re-build"
   buildThis["$folderChanged"]="true"

   # If there is a change on a "special" folder break early - Deploy all
   if [[ ${specialFolders[@]} =~ $folderChanged ]]; then
      break
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
     [[ $_arg_test -gt 0 ]] && echo deployAll && exit 0
     deployAll
     exit 0
  fi
done

for folder in "${!buildThis[@]}"; do
   echo "------------------------------"
   echo "Building $folder"
   [[ $_arg_test -gt 0 ]] && echo 'deploymentSteps' && continue
   cd $folder
   echo $PWD
   deploymentSteps
   cd $rootDir
done

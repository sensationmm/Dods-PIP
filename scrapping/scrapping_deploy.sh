#! /usr/bin/env bash

set -eo pipefail

rootDir=$PWD
BB_URL="https://api.bitbucket.org/2.0/repositories/${BITBUCKET_REPO_FULL_NAME}"

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
    [ -f 'package.json' ] && npm install
    [ -f 'requirements.txt' ] && pip3 install -r requirements.txt
    [ -f 'serverless.yml' ] && sls deploy
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

bbAPI() {
    local URL=$1
    curl -s -g -u ${BITBUCKET_USER}:${BITBUCKET_PASSWORD} ${BB_URL}/${URL}
}

#-- main --

parse_commandline "$@"
_changes=0

# Changes on these folders trigger rebuild on all lambda folders
specialFolders=('lib' 'templates')                  

# Folders to rebuild according to changes
declare -A buildThis

# Determine what changed in current commit
[[ $_arg_verbose -gt 0 ]] && echo "verbose mode ON: Checking commits on ${BITBUCKET_BRANCH}"

# On bitbucket pipelines we only get a clone of the pushed branch. This makes it hard to ask Git
# for the specific changes from master to the current branch.
# As way around it ... drum roll please ... Bitbucket API
originMasterHash=$(curl -s -g -u ${BITBUCKET_USER}:${BITBUCKET_PASSWORD} "${BB_URL}/commits/?include=${BITBUCKET_BRANCH}&exclude=master" |  jq -r "[.values[].parents[].hash]|last")

committedChanges=$(git diff ${originMasterHash}..${BITBUCKET_BRANCH} --compact-summary --stat=180,120)

# [[ $_arg_verbose -gt 0 ]] && echo $committedChanges
echo "---------------------"

readarray -t changesList <<<"${committedChanges}"

# if [[ -z ${changesList[0]} ]]; then
#   echo "No changes commited on current branch (${BITBUCKET_BRANCH})"
#   exit 0
# fi

re_changes='(scrapping\/(.*)\/(.*\.[[:alnum:]]+))[[:space:]]+\|'
re_newOrRemoved='(scrapping\/(.*)\/(.*\.[[:alnum:]]+).*\((.*)\))[[:space:]]+\|'

for line in "${changesList[@]}"; do
# for line in "${committedChanges}"; do
   folderChanged=''
   fileName=''
   changeType='' 
   [[ $_arg_verbose -gt 0 ]] && echo "$line"
   # Handle output for new or removed files in the repo
   if [[ $line =~ $re_newOrRemoved ]]; then
      folderChanged=${BASH_REMATCH[2]}
      fileName=${BASH_REMATCH[3]}
      changeType=${BASH_REMATCH[4]}
      [[ $_arg_verbose -gt 0 ]] && echo "DEBUG +-: folder '$folderChanged', '${BASH_REMATCH[0]}'"
   fi
   # Handle output for changed files in the repo
   if [[ $line =~ $re_changes ]]; then
      [[ $_arg_verbose -gt 0 ]] && echo "DEBUG: folder '$folderChanged', '${BASH_REMATCH[0]}'"
      folderChanged=${BASH_REMATCH[2]}
      fileName=${BASH_REMATCH[3]}
      changeType='changed'
   fi

   if [[ -n $folderChanged ]]; then
      _changes=$((_changes + 1))
      [[ $_arg_verbose -gt 0 ]] && echo "$fileName is $changeType on folder $folderChanged"
      # Gone files do NOT merit a rebuild - To consider if we should handle a destroy
      if [[ "$changeType" == "gone" ]]; then
         continue
      fi
      [[ $_arg_verbose -gt 0 ]] && echo "$folderChanged will need a re-build"
      buildThis["$folderChanged"]="true"

      # If there is a change on a "special" folder break early - Deploy all
      if [[ ${specialFolders[@]} =~ $folderChanged ]]; then
         [[ $_arg_verbose -gt 0 ]] && echo "DEBUG: change in 'special', breaking early"
         break
      fi
   fi
done

if [[ _changes -lt 1 ]]; then
  echo "------------------------------------------------------------------------"
  echo "* Committed changes won't trigger re-deployments according to my logic *"
  echo "------------------------------------------------------------------------"
  exit 0
fi

# Nothing to build for changes on root of scrapping 
if [[ ${buildThis['scrapping']} ]]; then
  unset buildThis['scrapping']
fi

echo "Found buildable changes on ${#buildThis[@]} folders: ${!buildThis[@]}"

for special in "${specialFolders[@]}"; do
  if [[ ${buildThis[$special]} == "true" ]]; then
     echo "-----------------------------------------------------------------------"
     echo "* Found changes on folder ${special}. All Lambdas will be redeployed. *"
     echo "-----------------------------------------------------------------------"
     [[ $_arg_test -gt 0 ]] && echo deployAll && exit 0
     deployAll
     exit 0
  fi
done

for folder in "${!buildThis[@]}"; do
   echo "---------------------------------"
   echo "* Deploying Lambda from $folder *"
   echo "---------------------------------"
   [[ $_arg_test -gt 0 ]] && echo 'deploymentSteps' && continue
   cd $folder
   echo $PWD
   deploymentSteps
   cd $rootDir
done

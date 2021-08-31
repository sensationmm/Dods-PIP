#! /usr/bin/env bash

# This will create a basic scaffold folder for a lambda function
# used for scrapping content for the Dod PIP project

set -o pipefail
set -e

version="0.1"

die()
{
	local _ret="${2:-1}"
	echo "$1" >&2
	test "${_PRINT_HELP:-no}" = yes && print_help >&2
	exit "${_ret}"
}

begins_with_short_option()
{
	local first_option all_short_options='cVvh'
	first_option="${1:0:1}"
	test "$all_short_options" = "${all_short_options/$first_option/}" && return 1 || return 0
}

# THE DEFAULTS INITIALIZATION - OPTIONALS
_folder=""
_arg_verbose=0

print_help()
{
	printf '%s\n' ""
	printf 'Usage: %s -c|--create <folder for lambda> [-V|--verbose] [-v|--version] [-h|--help]\n' "$0"
	printf '\t%s\n' "-c, --create: folder to host the lambda. This folder MUST NOT EXIST."
	printf '\t%s\n' "-V, --verbose: how much verbose to be"
	printf '\t%s\n' "-v, --version: Prints version"
	printf '\t%s\n' "-h, --help: Prints help"
}

parse_commandline()
{
	while test $# -gt 0
	do
		_key="$1"
		case "$_key" in
			-c|--create)
				test $# -lt 2 && die "Missing value for the create argument '$_key'." 1
				_folder="$2"
				shift
				;;
			--create=*)
				_folder="${_key##--create=}"
				;;
			-c*)
				_folder="${_key##-c}"
				;;
			-V|--verbose)
				_arg_verbose=$((_arg_verbose + 1))
				;;
			-V*)
				_arg_verbose=$((_arg_verbose + 1))
				_next="${_key##-V}"
				if test -n "$_next" -a "$_next" != "$_key"
				then
					{ begins_with_short_option "$_next" && shift && set -- "-V" "-${_next}" "$@"; } || die "The short option '$_key' can't be decomposed to ${_key:0:2} and -${_key:2}, because ${_key:0:2} doesn't accept value and '-${_key:2:1}' doesn't correspond to a short option."
				fi
				;;
			-v|--version)
				echo test v$version
				exit 0
				;;
			-v*)
				echo test v$version
				exit 0
				;;
			-h|--help)
				print_help
				exit 0
				;;
			-h*)
				print_help
				exit 0
				;;
			*)
				_PRINT_HELP=yes die "FATAL ERROR: Got an unexpected argument '$1'" 1
				;;
		esac
		shift
	done
}

parse_commandline "$@"

# [ 
if [[ -z "$_folder" ]]; then
   _PRINT_HELP=yes die "ERROR: Need to pass a function name to bootstrap." 1
fi

# Don't want to risk it with non-POSIX characters on the folder name (never trust user input kinda thing)
_cleanedFolder=$(echo ${_folder//[^a-zA-Z0-9]/-})

# serverless names don't like underscores or capitalized letter. Make sure to have a proper string from input
_sls_name=$(echo ${_cleanedFolder,,})

# Test folder inexistence
if [[ -d "$_cleanedFolder" ]]; then
   _PRINT_HELP=yes die "ERROR: A folder with name '${_folder}' already exists in this repo." 1
fi

if [[ ${_arg_verbose} -ge 1 ]]; then
   echo "Creating folder '${_cleanedFolder}' with  SLS service named 'scraper-${_sls_name}'"
fi

mkdir ${_cleanedFolder}
if [[ ${_arg_verbose} -ge 1 ]]; then
   echo "Folder created ..."
fi

cp ../tools/scraper-template-folder/* ${_cleanedFolder}
cp ../tools/scraper-template-folder/.gitignore ${_cleanedFolder}
if [[ ${_arg_verbose} -ge 1 ]]; then
   echo "Templates copied ..."
fi

# Add symbolic links for custom dependencies
cd ${_cleanedFolder}
ln -s ../lib lib
ln -s ../templates templates


export TPL_SLS_NAME=${_sls_name}
envsubst < "serverless.yml.tpl" > serverless.yml
envsubst < "package.json.tpl" > package.json
envsubst < "package-lock.json.tpl" > package-lock.json
rm *.tpl

if [[ ${_arg_verbose} -ge 1 ]]; then
   echo "Substitutions completed."
fi

echo "Done."
exit 0
# ] 

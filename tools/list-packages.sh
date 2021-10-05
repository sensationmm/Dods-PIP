#!/bin/bash

##
# This is temporary implementation based on config files.
#- TODO: List of supported packages should come from Bazel -#
##

##
# List all known packages.
# Package is identified with relative path to package's root directory from repository root.
# 
# Packages are defined in file `packages.txt` under ci script's root directory (one level up from this script).
# This file should contain lines with glob patters pointing to root directories of all supported packages.
#
# Usage:
#   list-packages.sh
##

set -e

# Find script directory (no support for symlinks)
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Just resolve all patterns in packages file
for PACKAGE in $(cat ${DIR}/../packages.txt); do 
	echo ${PACKAGE} 
done

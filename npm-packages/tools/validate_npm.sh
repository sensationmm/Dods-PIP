#! /usr/bin/env bash

NPM_PACKAGE=$(cat package.json| jq -r '.name')
PKG_VERSION=$(cat package.json| jq -r '.version')

VERSIONS=$(npm view "$NPM_PACKAGE" versions --json)
FOUND=$(echo $VERSIONS | grep -c "$PKG_VERSION")

if [[ $FOUND -gt 0 ]]; then
   echo "ERROR: Version: $PKG_VERSION for $NPM_PACKAGE has been used before."
   echo "Previous versions for $NPM_PACKAGE are:"
   echo $VERSIONS | jq -c '.'
   exit 1
fi
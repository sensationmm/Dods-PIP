#! /usr/bin/env bash

FILE_CHANGES=$(git status -s -uno)
FC_COUNT=$(echo $FILE_CHANGES | wc -l)

if [[ $FC_COUNT -gt 0 ]]; then
  printf "Committing following changes:\n%s\n" "$FILE_CHANGES"
  git add -A && \
  git commit -m "Updated terraform configuration [skip ci]" && \
  git push
else
  echo "No push back needed"
fi

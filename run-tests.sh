#!/usr/bin/env bash

VALID_JOBS=("smoke" "sauce")

if [ "$JOB" == "" ]; then
  echo "Error: No job specified."
  exit
fi

if [[ ${VALID_JOBS[*]} =~ $JOB ]]; then
  echo -e "\nRunning Test Job: $JOB\n"
  gulp $JOB
else
  echo -e "\nUnknown Test Job: [$JOB]\n"
fi

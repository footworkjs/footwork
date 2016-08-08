#!/usr/bin/env bash

if [ "$JOB" = "smoke" ]; then
  echo "Test Environment: smoke"
  gulp tests
elif [ "$JOB" = "sauce" ]; then
  echo "Test Environment: SauceLabs"
  gulp coveralls
fi

#!/usr/bin/env bash

if [ "$JOB" = "smoke" ]; then
  gulp tests
elif [ "$JOB" = "sauce" ]; then
  gulp coveralls
fi

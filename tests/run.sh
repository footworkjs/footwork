#!/usr/bin/env bash

if [ "$JOB" = "smoke" ]; then
  echo -e "\nRunning Test Job: smoke\n"
  gulp coveralls
elif [ "$JOB" = "sauce" ]; then
  echo -e "\nRunning Test Job: SauceLabs\n"
  gulp sauce
else
  echo -e "\nUnknown Test Job: [$JOB]\n"
fi

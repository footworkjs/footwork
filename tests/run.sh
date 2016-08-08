#!/usr/bin/env bash
set -ev

if [ "$JOB" = "smoke" ]; then
  echo -e "\nRunning Test Job: \e[92msmoke\e[0m\n"
  gulp coveralls
elif [ "$JOB" = "sauce" ]; then
  echo -e "\nRunning Test Job: \e[92mSauceLabs\e[0m\n"
  gulp sauce
else
  echo -e "\n\e[93mUnknown Test Job\e[0m: \e[91m$JOB\e[0m\n"
fi

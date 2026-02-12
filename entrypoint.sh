#!/bin/bash
set +x  # Exit on errors

envFilename=".env.production"
nextFolder="./.next/"

function apply_path {
  echo "Reading environment variables from $envFilename..."

  while IFS='=' read -r configName configValue; do
    echo "found $configName"
    # Ignore empty lines and comments
    [[ -z "$configName" || "$configName" =~ ^# ]] && continue

    # Get system environment variable value
    envValue=$(printenv "$configName")

    if [[ -n "$configValue" && -n "$envValue" ]]; then
      echo "Replacing '$configValue' with '$envValue' for '$configName'..."
      find "$nextFolder" -type f -print0 | xargs -0 sed -i "s|$configValue|$envValue|g"
      echo "Replaced '$configValue' with '$envValue' for '$configName'."
    fi
  done < "$envFilename"
}

apply_path

echo "Starting WebApp..."
exec "$@"

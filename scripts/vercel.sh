#!/bin/bash

echo "VERCEL_ENV: $VERCEL_ENV"

if [[ "$VERCEL_ENV" == "production" ]] ; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  cd ../../
  npm install
  npm install lerna -g
  lerna bootstrap
  cd ./packages/client
  exit 1;
else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi
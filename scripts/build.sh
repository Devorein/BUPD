#!/bin/bash

npm install
lerna bootstrap
npm run build
npm run lint
npm run test
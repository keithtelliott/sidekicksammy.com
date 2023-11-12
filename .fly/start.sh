#!/bin/sh

set -ex

if [ -n $MIGRATE_ON_BOOT ]; then
  $(dirname $0)/migrate.sh
fi

# npx rw-server --port ${PORT} $@
# https://community.redwoodjs.com/t/render-modes-ssr-streaming-experimental/4858/2
# KTE, 11/11/2023

node node_modules/@redwoodjs/api-server/dist/index.js api &
yarn rw-serve-fe

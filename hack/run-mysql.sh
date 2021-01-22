#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")"

MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
MYSQL_VERSION=${MYSQL_VERSION:-"5.7.31"}

docker run \
  --name mysql -d \
   -e MYSQL_ROOT_PASSWORD="$MYSQL_ROOT_PASSWORD" \
   -v "$(pwd)"/mysql:/var/lib/mysql \
   -p 3306:3306 \
   mysql:"$MYSQL_VERSION"

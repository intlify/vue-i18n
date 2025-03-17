#!/bin/bash

set -e

PACKAGE_NAME="vue-i18n"
DEPRECATE_MESSAGE="Vue I18n v8.x has reached EOL and is no longer actively maintained. About maintenance status, see https://vue-i18n.intlify.dev/guide/maintenance.html"

# fetch verions with `npm show``
VERSIONS=$(pnpm show "$PACKAGE_NAME" versions --json | jq -r '.[]')

# configure deprecate versions
DEPRECATE_VERSIONS=()
for VERSION in $VERSIONS; do
  if [[ $VERSION == 8.* ]]; then
    DEPRECATE_VERSIONS+=("$VERSION")
  fi
done

# deprecate
for VERSION in "${DEPRECATE_VERSIONS[@]}"; do
  echo "Deprecating $PACKAGE_NAME@$VERSION..."
  pnpm deprecate "$PACKAGE_NAME@$VERSION" "$DEPRECATE_MESSAGE"
  sleep 1.0
done

echo "Deprecation process completed."

#!/bin/bash

set -e

VERSION=$1
TAG=$2

PKGS=(
  @intlify/core
  @intlify/core-base
  @intlify/devtools-types
  @intlify/message-compiler
  @intlify/shared
  @intlify/vue-i18n-core
  petite-vue-i18n
  vue-i18n
)

if [ -z "$VERSION" ]; then
  echo "Usage: $0 <version> <tag>"
  exit 1
fi

if [ -z "$TAG" ]; then
  echo "Usage: $0 <version> <tag>"
  exit 1
fi

for PKG in ${PKGS[@]} ; do
  npm dist-tag add $PKG@$VERSION $TAG
done

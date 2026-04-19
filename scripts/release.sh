#!/bin/bash

set -e

# Restore all git changes
git restore -s@ -SW  -- packages

# Build
pnpm build:type

# Release packages
for PKG in packages/* ; do
  if [[ -d $PKG ]]; then
    if [[ $PKG == packages/size-* || $PKG == packages/format-explorer ]]; then
      continue
    fi
    pushd $PKG
    TAG="next"
    echo "⚡ Publishing $PKG with tag $TAG"
    pnpm publish --access public --no-git-checks --tag $TAG
    popd > /dev/null
  fi
done

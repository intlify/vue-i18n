#!/bin/bash

set -xe

# Restore all git changes
git restore -s@ -SW  -- packages

# Bump versions
tsx ./scripts/bump.ts

# Update token
if [[ ! -z ${NPM_AUTH_TOKEN} ]] ; then
  echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" >> ~/.npmrc
  echo "registry=https://registry.npmjs.org/" >> ~/.npmrc
  echo "always-auth=true" >> ~/.npmrc
  npm whoami
fi

# Release packages
for PKG in packages/* ; do
  if [[ -d $PKG ]]; then
    if [[ $PKG == packages/size-* || $PKG == packages/format-explorer ]]; then
      continue
    fi
    pushd $PKG
    echo "⚡ Publishing $PKG with edge tag"
    pnpm publish --access public --no-git-checks --tag nightly
    popd
  fi
done

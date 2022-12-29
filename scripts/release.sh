#!/bin/bash

set -e

# Restore all git changes
git restore -s@ -SW  -- packages

# Build
pnpm build --all -t

# Update token
if [[ ! -z ${NPM_AUTH_TOKEN} ]] ; then
  echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" >> ~/.npmrc
  echo "registry=https://registry.npmjs.org/" >> ~/.npmrc
  echo "always-auth=true" >> ~/.npmrc
  npm whoami
fi

# Release packages
for PKG in packages/* ; do
  pushd $PKG
  TAG="next"
  echo "⚡ Publishing $PKG with tag $TAG"
  pnpm publish --access public --no-git-checks --tag $TAG
  popd > /dev/null
done

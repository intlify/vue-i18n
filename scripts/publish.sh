#!/usr/bin/env bash
# Publish the packages to npm in the order of their dependencies, used by .github/workflows/release.yml.
#
# The registry shows a published version after a delay, which differs by package (from about one minute to
# several minutes), and its install metadata is cached for up to 5 minutes (cache-control: max-age=300).
# A package that is visible before its dependencies cannot be installed (ETARGET), so the packages are
# published layer by layer, and each layer is waited for until it is visible on the registry. Before the
# last layer (the packages that users install), the cache of the layers before it is also waited out.
# Versions that are already on the registry are skipped, so a failed run can be run again.
#
# usage: DIST_TAG=<tag> bash scripts/publish.sh
# env:
#   DIST_TAG      the npm dist-tag (required)
#   DRY_RUN=1     `pnpm publish --dry-run`, without waiting
#   CACHE_WAIT    seconds to wait before the last layer (default: 300)
#   WAIT_TIMEOUT  seconds to wait for a version to be visible (default: 900)
set -euo pipefail

: "${DIST_TAG:?DIST_TAG is required}"
DRY_RUN=${DRY_RUN:-}
CACHE_WAIT=${CACHE_WAIT:-300}
WAIT_TIMEOUT=${WAIT_TIMEOUT:-900}
REGISTRY=https://registry.npmjs.org

# the directories under packages/, dependencies first.
# core-base and devtools-types depend on each other, so they are in the same layer
LAYERS=(
  'shared'
  'message-compiler'
  'core-base devtools-types'
  'core vue-i18n-core'
  'vue-i18n petite-vue-i18n'
)

field() { # <dir> <field>
  node -p "require('./packages/$1/package.json').$2"
}

visible() { # <name> <version>: the version document is not cached by the CDN of the registry
  curl -fsS --max-time 30 --retry 3 --retry-delay 2 -o /dev/null "$REGISTRY/${1/\//%2f}/$2"
}

wait_visible() { # <name> <version>
  local start=$SECONDS
  until visible "$1" "$2"; do
    if ((SECONDS - start >= WAIT_TIMEOUT)); then
      echo "::error::$1@$2 is not visible on $REGISTRY after ${WAIT_TIMEOUT}s" >&2
      return 1
    fi
    sleep 10
  done
  echo "$1@$2 is visible ($((SECONDS - start))s)"
}

# every package that is published must be in LAYERS, so that a new package is not left out
listed=" ${LAYERS[*]} "
for dir in packages/*/; do
  dir=$(basename "$dir")
  [[ $(field "$dir" private) == true ]] && continue
  if [[ $listed != *" $dir "* ]]; then
    echo "::error::packages/$dir is not in LAYERS of scripts/publish.sh" >&2
    exit 1
  fi
done

last=$((${#LAYERS[@]} - 1))
for i in "${!LAYERS[@]}"; do
  todo=()
  for dir in ${LAYERS[$i]}; do
    name=$(field "$dir" name)
    version=$(field "$dir" version)
    if visible "$name" "$version"; then
      echo "Skipping $name@$version (already on the registry)"
    else
      todo+=("$dir")
    fi
  done
  ((${#todo[@]})) || continue

  if ((i == last)); then
    echo "Waiting ${CACHE_WAIT}s, so that the cached metadata of the dependencies has expired"
    [[ -n $DRY_RUN ]] || sleep "$CACHE_WAIT"
  fi

  args=(--access public --no-git-checks --tag "$DIST_TAG")
  if [[ -n $DRY_RUN ]]; then args+=(--dry-run); else args+=(--provenance); fi
  for dir in "${todo[@]}"; do
    echo "Publishing $(field "$dir" name)@$(field "$dir" version) with tag $DIST_TAG"
    (cd "packages/$dir" && pnpm publish "${args[@]}")
  done

  for dir in "${todo[@]}"; do
    if [[ -n $DRY_RUN ]]; then
      echo "(dry run) would wait until $(field "$dir" name)@$(field "$dir" version) is visible"
    else
      wait_visible "$(field "$dir" name)" "$(field "$dir" version)"
    fi
  done
done

#!/bin/bash

set -xe

pnpm build --types

tail -n +37 ./packages/vue-i18n/src/vue.d.ts >> ./packages/vue-i18n/dist/vue-i18n.d.ts
tail -n +32 ./packages/petite-vue-i18n/src/vue.d.ts >> ./packages/petite-vue-i18n/dist/petite-vue-i18n.d.ts
tail -n +37 ./packages/vue-i18n-bridge/src/vue.d.ts >> ./packages/vue-i18n-bridge/dist/vue-i18n-bridge.d.ts

node -r esbuild-register scripts/postprocess.ts

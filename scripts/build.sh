#!/bin/bash

set -xe

pnpm build --types

node -r esbuild-register scripts/postprocess.ts

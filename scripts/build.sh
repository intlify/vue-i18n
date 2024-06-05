#!/bin/bash

set -xe

pnpm build --types

tsx ./scripts/postprocess.ts

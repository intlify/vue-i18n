#!/bin/bash

set -e

pnpm build --withTypes

tsx ./scripts/postprocess.ts

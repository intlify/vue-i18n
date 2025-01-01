#!/bin/bash

set -e

pnpm build --withTypes --size

tsx ./scripts/postprocess.ts

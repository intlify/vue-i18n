/*
Run Rollup in watch mode for development.

To specific the package to watch, simply pass its name and the desired build
formats to watch (defaults to "global"):

```
# name supports fuzzy match. will watch all packages with name containing "core-base"
pnpm dev core-base

# specify the format to output
pnpm dev core --formats cjs

# Can also drop all __DEV__ blocks with:
__DEV__=false pnpm run dev
```
*/

import { execa } from 'execa'
import { spawnSync } from 'node:child_process'
import { parseArgs } from 'node:util'
import { fuzzyMatchTarget } from './utils'

const commit = spawnSync('git', ['rev-parse', '--short=7', 'HEAD'])
  .stdout.toString()
  .trim()

const { values, positionals: targets } = parseArgs({
  allowPositionals: true,
  options: {
    formats: {
      type: 'string',
      short: 'f'
    },
    sourceMap: {
      type: 'boolean',
      short: 's'
    }
  }
})

const { formats: rawFormats, sourceMap } = values

const formats = rawFormats?.split(',')

async function main() {
  const resolveTarget = targets.length
    ? (await fuzzyMatchTarget(targets))[0]
    : 'vue-i18n'

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  execa(
    'rollup',
    [
      '-wc',
      '--environment',
      [
        `COMMIT:${commit}`,
        `TARGET:${resolveTarget}`,
        `FORMATS:${formats || 'global'}`,
        sourceMap ? `SOURCE_MAP:true` : ``
      ]
        .filter(Boolean)
        .join(',')
    ],
    {
      stdio: 'inherit'
    }
  )
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})

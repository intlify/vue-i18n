/*
Run Rollup in watch mode for development.

To specific the package to watch, simply pass its name and the desired build
formats to watch (defaults to "global"):

```
# name supports fuzzy match. will watch all packages with name containing "core-base"
yarn dev core-base

# specify the format to output
yarn dev core --formats cjs

# Can also drop all __DEV__ blocks with:
__DEV__=false yarn dev
```
*/

import execa from 'execa'
import { fuzzyMatchTarget } from './utils'
import minimist from 'minimist'

;(async () => {
  const args = minimist(process.argv.slice(2))
  const targets = await fuzzyMatchTarget(args._)
  const target = args._.length ? targets[0] : 'vue-i18n'
  const formats = args.formats || args.f
  const sourceMap = args.sourcemap || args.s
  const { stdout } = await execa('git', ['rev-parse', 'HEAD'])
  const commit = stdout.slice(0, 7)

  execa(
    'rollup',
    [
      '-wc',
      '--environment',
      [
        `COMMIT:${commit}`,
        `TARGET:${target}`,
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
})()

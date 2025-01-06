/*
Produces production builds and stitches together d.ts files.

To specify the package to build, simply pass its name and the desired build
formats to output (defaults to `buildOptions.formats` specified in that package,
or "esm,cjs"):

```
# name supports fuzzy match. will build all packages with name containing "core-base":
pnpm build core-base

# specify the format to output
pnpm build core --formats cjs
```
*/

import { spawnSync } from 'node:child_process'
import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { brotliCompressSync, gzipSync } from 'node:zlib'
import pc from 'picocolors'
import { rolldown } from 'rolldown'
import { buildTypings } from './build-types'
import { createConfigsForPackage } from './rolldown'
import {
  targets as allTargets,
  checkSizeDistFiles,
  displaySize,
  fuzzyMatchTarget,
  readJson
} from './utils'

import type { OutputOptions } from 'rolldown'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
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
    devOnly: {
      type: 'boolean',
      short: 'd'
    },
    prodOnly: {
      type: 'boolean',
      short: 'p'
    },
    withTypes: {
      type: 'boolean',
      short: 't'
    },
    sourceMap: {
      type: 'boolean',
      short: 's'
    },
    release: {
      type: 'boolean'
    },
    all: {
      type: 'boolean',
      short: 'a'
    },
    size: {
      type: 'boolean'
    }
  }
})

const {
  formats: rawFormats,
  all: buildAllMatching,
  devOnly,
  prodOnly,
  withTypes: buildTypes,
  sourceMap,
  release: isRelease,
  size
} = values

const formats = rawFormats?.split(',')
const sizeDir = path.resolve(__dirname, '../temp/size')

async function main() {
  await run()

  async function run() {
    if (size) {
      await fs.mkdir(sizeDir, { recursive: true })
    }

    const resolvedTargets = targets.length
      ? await fuzzyMatchTarget(targets, buildAllMatching)
      : await allTargets()
    await buildAll(resolvedTargets)

    if (size) {
      await checkAllSizes(resolvedTargets)
    }

    if (buildTypes) {
      await buildTypings(resolvedTargets)
    }
  }

  async function buildAll(targets: string[]) {
    const start = performance.now()
    const all = []
    let count = 0
    for (const target of targets) {
      const configs = await createConfigsForTarget(target)
      if (configs) {
        all.push(
          Promise.all(
            configs.map(c =>
              rolldown(c).then(bundle => {
                return bundle.write(c.output as OutputOptions).then(() => {
                  return path.join(
                    'packages',
                    target,
                    'dist',
                    // @ts-expect-error
                    path.basename(c.output.file)
                  )
                })
              })
            )
          ).then(files => {
            files.forEach(f => {
              count++
              console.log(pc.gray('built: ') + pc.green(f))
            })
          })
        )
      }
    }
    await Promise.all(all)
    console.log(
      `\n${count} files built in ${(performance.now() - start).toFixed(2)}ms.`
    )
  }

  async function createConfigsForTarget(target: string) {
    const pkgDir = path.resolve(__dirname, `../packages/${target}`)
    const pkg = await readJson(`${pkgDir}/package.json`)

    // only build published packages for release
    if (isRelease && pkg.private) {
      return
    }

    // if building a specific format, do not remove dist.
    if (!formats && existsSync(`${pkgDir}/dist`)) {
      await fs.rm(`${pkgDir}/dist`, { recursive: true })
    }

    return createConfigsForPackage({
      target,
      commit,
      formats,
      prodOnly,
      sourceMap
    })
  }

  async function checkAllSizes(targets: string[]) {
    if (devOnly) {
      return
    }
    console.log()
    for (const target of targets) {
      await checkSize(target)
    }
    console.log()
  }

  async function checkSize(target: string) {
    const pkgDir = path.resolve(`packages/${target}`)
    const files = await checkSizeDistFiles(pkgDir)
    for (const file of files) {
      await checkFileSize(`${pkgDir}/dist/${file}`)
    }
  }

  async function checkFileSize(filePath: string) {
    if (!existsSync(filePath)) {
      return
    }
    const file = await fs.readFile(filePath)
    const filename = path.basename(filePath)

    const gzipped = gzipSync(file)
    const brotli = brotliCompressSync(file)
    console.log(
      `📦  ${pc.green(
        pc.bold(path.basename(filePath))
      )} - min: ${displaySize(file.length)} / gzip: ${displaySize(gzipped.length)} / brotli: ${displaySize(brotli.length)}`
    )

    if (size) {
      const sizeContents = JSON.stringify(
        {
          file: filename,
          size: file.length,
          gzip: gzipped.length,
          brotli: brotli.length
        },
        null,
        2
      )
      await fs.writeFile(
        path.resolve(sizeDir, `${filename}.json`),
        sizeContents,
        'utf-8'
      )
    }
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
